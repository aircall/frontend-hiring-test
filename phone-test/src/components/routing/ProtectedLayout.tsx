import { Outlet, Link } from 'react-router-dom';
import { Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../assets/logo.png';

export const ProtectedLayout = () => {
  return (
    <Flex flexDirection="column" maxWidth={768} p={4} w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome {username}!`}</span>
          <Link to="/login">logout</Link>
        </Spacer>
      </Flex>
      <Grid mx="auto" rowGap={2} w="100%">
        <Outlet />
      </Grid>
    </Flex>
  );
};
