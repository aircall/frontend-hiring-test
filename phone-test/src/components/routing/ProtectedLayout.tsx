import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Flex, Spacer, Grid } from '@aircall/tractor';
import logo from '../../logo.png';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useRefValue } from '../../hooks/useRefValue';

export const ProtectedLayout = () => {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRefValue(location);

  useEffect(() => {
    if (!user) {
      navigate('/login', {
        replace: true,
        state: {
          redirectTo: locationRef.current.pathname + locationRef.current.search
        }
      });
    }
  }, [navigate, user, locationRef]);

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${user?.username || 'unknown user'}!`}</span>
          <Link to="/logout">logout</Link>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        {status === 'loading' && 'Logging in...'}
        {status === 'done' && <Outlet />}
      </Grid>
    </Box>
  );
};
