import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../gql/queries/getUser';

export const ProtectedLayout = () => {
  const { logout } = useAuth();
  let location = useLocation();

  const { loading, data } = useQuery(GET_USER);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.me) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${data?.me.username}!`}</span>
          <button onClick={() => logout()}>logout</button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
