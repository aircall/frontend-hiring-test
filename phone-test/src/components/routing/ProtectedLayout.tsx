import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Box, Flex, Spacer, Grid, useToast } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../gql/queries/getUser';
import { useCallback, useEffect } from 'react';

export const ProtectedLayout = () => {
  const { logout } = useAuth();

  const { loading, data } = useQuery(GET_USER);
  const handleLogOut = useCallback(logout, [logout]);
  const { showToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !data?.me) {
      showToast({
        message: 'Your session has expired, please login again',
        variant: 'warning',
        dismissIn: 5000
      });
      navigate('/login', { replace: true });
    }
  }, [data?.me, loading, navigate, showToast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.me) {
    return <div>You aren't authorized to view this page</div>;
  }

  return (
    <Box minWidth="100vw" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${data.me.username}!`}</span>
          <button onClick={handleLogOut}>logout</button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
