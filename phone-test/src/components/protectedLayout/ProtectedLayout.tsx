import { Button, Flex, Grid, Spacer } from '@aircall/tractor';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex flexDirection="column" maxWidth={768} p={4} w="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          {user && <span>Welcome {user?.username}!</span>}
          <Button onClick={handleLogout} size="xSmall" variant="primary">
            Logout
          </Button>
        </Spacer>
      </Flex>
      <Grid mx="auto" rowGap={2} w="100%">
        <Outlet />
      </Grid>
    </Flex>
  );
};
