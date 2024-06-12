import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../gql/queries/getUser';

export const ProtectedLayout = () => {
  const { logout } = useAuth();
  let location = useLocation();

  const { loading, error, data } = useQuery(GET_USER);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.me || error) {
    // Redirect to login page if user is not logged in or access key is expired
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box minWidth="100vw" p={4}>
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
