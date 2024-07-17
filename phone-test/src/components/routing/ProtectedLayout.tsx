import { Flex, Spacer, Grid, Button } from '@aircall/tractor';
import logo from '../../logo.png';
import { PropsWithChildren } from 'react';
import { AppContainer } from '../AppContainer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const { user, logout } = useAuth();

  return (
    <Flex
      display="flex"
      flex={1}
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      minHeight={'100vh'}
      minWidth={'100vw'}
      p={4}
    >
      <Flex minWidth="100%" justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${user?.username ?? ''}!`}</span>
          <Button size="xSmall" variant="destructive" data-testid="logout" onClick={logout}>
            Logout
          </Button>
        </Spacer>
      </Flex>
      <AppContainer>
        <Grid flex={1} rowGap={2}>
          {children}
        </Grid>
      </AppContainer>
    </Flex>
  );
};
