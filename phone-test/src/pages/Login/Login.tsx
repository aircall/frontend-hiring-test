import * as React from 'react';

import { Flex, Icon, LogoMarkMono, Spacer, useToast } from '@aircall/tractor';

import { FormState } from './Login.decl';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../gql/queries/getUser';

const LOGIN_REJECTED = 'LOGIN_REJECTED';
const SESSION_EXPIRED = 'SESSION_EXPIRED';

export const LoginPage = () => {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formState, setFormState] = React.useState<FormState>('Idle');
  const { showToast, removeToast } = useToast();

  const { loading, data } = useQuery(GET_USER);

  useEffect(() => {
    if (searchParams.get('sessionExpired')) {
      removeToast(LOGIN_REJECTED);
      showToast({
        id: SESSION_EXPIRED,
        message: 'Your session has expired, please login again',
        variant: 'warning',
        dismissIn: 5000
      });
      setSearchParams({});
    }
  }, [removeToast, searchParams, setSearchParams, showToast]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <Navigate to="/calls" replace />;
  }

  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm onSubmit={onSubmit} formState={formState} />
    </Spacer>
  );
};
