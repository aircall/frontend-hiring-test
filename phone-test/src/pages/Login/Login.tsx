import { Flex, Icon, LogoMarkMono, Spacer } from '@aircall/tractor';
import { LoginForm } from './LoginForm';
import { useAuth } from 'hooks/useAuth';
import Spinner from 'components/spinner/spinner';

export const LoginPage = () => {
  const { status } = useAuth();

  if (status === 'Loading') return <Spinner />;
  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm />
    </Spacer>
  );
};
