import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';
import { useQuery } from '@apollo/client';
import { ME } from '../../gql/queries/me';

export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { loading, error, data } = useQuery(ME);

  return (
    <Box minWidth="100vh" p={4} maxHeight="100vh" overflow="auto">
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          {!loading && !error && <span>{`Welcome ${data?.me?.username || 'User'}!`}</span>}
          <Link to="/login">logout</Link>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
