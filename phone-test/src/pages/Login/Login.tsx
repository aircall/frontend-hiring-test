import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Icon, LogoMarkMono, Spacer, useToast } from '@aircall/tractor';

import { useAuth } from '../../hooks/useAuth';
import { FormState } from './Login.decl';
import { LoginForm } from '../../components/loginForm/LoginForm';

const LOGIN_REJECTED = 'LOGIN_REJECTED';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formState, setFormState] = React.useState<FormState>('Idle');
  const { showToast, removeToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (email: string, password: string) => {
    try {
      setFormState('Pending');
      await login({ username: email, password });
      navigate('/calls');
      removeToast(LOGIN_REJECTED);
    } catch (error) {
      console.log(error);
      showToast({
        id: LOGIN_REJECTED,
        message: 'Invalid email or password',
        variant: 'error'
      });
    }
  };

  return (
    <Spacer
      direction="vertical"
      fluid
      h="100%"
      justifyContent="center"
      maxW={768}
      p={5}
      space={5}
      w="100%"
    >
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm onSubmit={onSubmit} formState={formState} />
    </Spacer>
  );
};
