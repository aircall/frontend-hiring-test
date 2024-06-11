import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

const AuthContext = createContext({
  login: ({}) => {},
  logout: () => {},
  user: undefined,
  status: 'loading',
  accessToken: undefined,
  refreshToken: undefined
});

export const AuthProvider = () => {
  const [user, setUser] = useState();
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: any) => {
      setStatus('loading');
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: any) => {
          const { access_token, refresh_token, user } = login;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setUser(user);
          console.log('redirect to calls');
          navigate('/calls');
          setStatus('completed');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken]
  );

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken]);

  const value = useMemo(() => {
    return {
      login,
      logout,
      user,
      status,
      accessToken,
      refreshToken
    };
  }, [login, logout, user, status, accessToken, refreshToken]);
  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
