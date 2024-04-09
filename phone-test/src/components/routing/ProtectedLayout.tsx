import { Outlet, Link, Navigate } from 'react-router-dom';
import { Box, Flex, Spacer, Grid, Button } from '@aircall/tractor';
import { AUTH_CONFIG } from '../../services/auth/authConfig';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../logo.png';

export const ProtectedLayout = () => {
  const { logout, checkIsLoggedIn } = useAuth();
  const [user] = useLocalStorage(AUTH_CONFIG.USER, undefined);

  const isLoggedIn = checkIsLoggedIn();

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${user?.username}!`}</span>
          <Button name="btn-logout" mode="link" onClick={logout} data-cy="btn-logout">
            Logout
          </Button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
