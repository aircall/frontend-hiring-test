import { Flex, Spacer } from '@aircall/tractor';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

export const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">Logging out...</Flex>
    </Spacer>
  );
};
