import * as React from 'react';

import { Flex, Icon, LogoMarkMono, Spacer, useToast } from '@aircall/tractor';

import { FormState } from './Login.decl';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const LOGIN_REJECTED = 'LOGIN_REJECTED';

export const LoginPage = () => {
  const [search] = useSearchParams();
  const { login } = useAuth();
  const [formState, setFormState] = React.useState<FormState>('Idle');
  const { showToast, removeToast } = useToast();
  const isTokenExpiredRedirect = search.get('token_expired') ? Boolean(search.get('token_expired')) : false;

  const onSubmit = async (email: string, password: string) => {
    try {
      setFormState('Pending');
      await login({ username: email, password });
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

  // If refresh token has expired and is not possible to get a new access token app redirencts to login page
  // If redirect comes with refresh token expired shows a toast informing the reasson of redirect.
  useEffect(() => {
    if (isTokenExpiredRedirect) {
      showToast({
        id: LOGIN_REJECTED,
        message: 'Session has expired, please login again.',
        variant: 'error'
      });
    }
  }, [])



  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm onSubmit={onSubmit} formState={formState} />
    </Spacer>
  );
};
