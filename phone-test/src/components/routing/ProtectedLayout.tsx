import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Spacer, Grid, useToast, Button } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedLayout = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const onLogout = () => {
    logout();
    showToast({
      message: 'You have been successfully logged out',
      variant: 'success',
      dismissIn: 3000
    });
  };

  return (
    <Box minWidth="100vh" p={4} alignSelf="self-start">
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome {username}!`}</span>
          <Button mode="link" onClick={onLogout}>
            logout
          </Button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
