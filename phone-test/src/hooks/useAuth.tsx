import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { ApolloClient, InMemoryCache, createHttpLink, useMutation } from '@apollo/client';
import { REFRESH } from '../gql/mutations/refreshTokenV2';
import { setContext } from '@apollo/client/link/context';

const AuthContext = createContext({
  login: ({}) => {},
  logout: () => {},
  refresh: ()=>{}
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [userName, setUserName] = useLocalStorage('username', '')
  const [loginMutation] = useMutation(LOGIN);
  const [refreshMutation] = useMutation(REFRESH)
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = ({ username, password, navigateToCalls }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUserName(user.username)
        console.log('redirect to calls');
        navigateToCalls ? navigate('/calls') : window.location.reload();
      }
    });
  };

  const refresh = () => {
    const httpLink = createHttpLink({
      uri: 'https://frontend-test-api.aircall.dev/graphql'
    });
    
    const authLink = setContext((_, { headers }) => {
      // get the refresh token from local storage if it exists
      const rToken = localStorage.getItem('refresh_token');
    const parsedToken = rToken ? JSON.parse(rToken) : undefined;
    
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          Authorization: accessToken ? `Bearer ${parsedToken}` : ''
        }
      };
    });
    
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return refreshMutation({
      client: client,
      fetchPolicy: 'network-only',
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUserName(user.username)
      }
    });
  }

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    setUserName('')
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => {
    return {
      login,
      logout,
      refresh
    };
  },[]);
  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
