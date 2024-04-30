import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER } from '../gql/queries/';

import { useLocalStorage } from './useLocalStorage';

type Credentials = {
  username: string;
  password: string;
};

type ProviderType = {
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
  error?: ApolloError;
};

const defaultState: ProviderType = {
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  user: null,
  loading: false
};

const AuthContext = createContext(defaultState);

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();
  const [getUser, { loading, error, data }] = useLazyQuery(GET_USER);
  const isAuthenticated = !!localStorage.getItem('access_token');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loggedInUser, setLoggedInUser] = useLocalStorage('logged_in_user', undefined);

  const login = useCallback(
    ({ username, password }: Credentials) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: any) => {
          const { access_token, refresh_token, user } = login;
          localStorage.setItem('access_token', JSON.stringify(access_token));
          localStorage.setItem('refresh_token', JSON.stringify(refresh_token));

          setLoggedInUser(user);
          setUser(user);
          console.log('redirect to calls');
          navigate('/calls');
        }
      });
    },
    [loginMutation, setLoggedInUser, setUser, navigate]
  );

  const logout = useCallback(() => {
    localStorage.setItem('access_token', '');
    localStorage.setItem('refresh_token', '');
    setUser(null);
    navigate('/login');
  }, [setUser, navigate]);

  // get user data at first render if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set user data if there is no error fetching user data
  useEffect(() => {
    if (data) {
      setUser(data.me);
    }
  }, [data]);

  // log out user if there is an error fetching user data
  useEffect(() => {
    if (error) {
      console.log(error);
      logout();
    }
  }, [error, logout]);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      user,
      loading
    }),
    [user, loading, isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
