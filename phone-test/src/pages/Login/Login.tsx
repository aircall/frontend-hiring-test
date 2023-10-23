import { Flex, Icon, LogoMarkMono, Spacer } from '@aircall/tractor';
import { LoginForm } from './LoginForm';

export const LoginPage = () => {
  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm />
    </Spacer>
  );
};
