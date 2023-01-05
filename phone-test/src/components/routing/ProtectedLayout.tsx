import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedLayout = () => {

  const { logout, user } = useAuth();

  //Call auth hook to remove token and redirect to login page.
  function onLogOut() {
    logout();
  }
 
  return (
    <Box minWidth="100vh" maxHeight="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${user?.username}!`}</span>
          <a onClick={onLogOut}>logout</a>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" maxHeight="100vh" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
