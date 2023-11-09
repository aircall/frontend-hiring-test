import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Spacer, Grid, Button } from '@aircall/tractor';
import logo from '../../logo.png';
import { GET_ME } from '../../gql/queries/getMe';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedLayout = () => {
  const { data } = useQuery(GET_ME);

  const { logout } = useAuth();

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${data?.me?.username}!`}</span>
          <Button mode="link" variant="primary" onClick={logout}>
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
