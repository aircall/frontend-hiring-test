import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';

import { useLocalStorage } from '../../hooks/useLocalStorage';

export const ProtectedLayout = () => {
  
  const [loggedInUser] = useLocalStorage('logged_in_user', undefined);
  const { username } = loggedInUser || 'User';

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${username}!`}</span>
          <Link to="/login">logout</Link>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
