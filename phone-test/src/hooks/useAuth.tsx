import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';
import { Token } from '../helpers/constants';
import { useToken } from './useToken';
import { isTokenExpired } from '../helpers/isTokenExpired';

const AuthContext = createContext({
  login: ({ username, password }: { username: string; password: string }) => {},
  logout: () => {},
  user: { id: '', username: '' }
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const { accessToken } = useToken();
  const [user, setUser] = useState({ id: '', username: '' });
  const [, setAccessToken] = useLocalStorage('access_token', undefined);
  const [, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/login' && !isTokenExpired(accessToken)) {
      navigate('/calls');
    } else if (pathname !== '/login' && isTokenExpired(accessToken)) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const login = useCallback(
    ({ username, password }: { username: string; password: string }) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: any) => {
          const { access_token, refresh_token, user } = login;
          setAccessToken(access_token);
          //let the apollo client know it has a new token available
          window.dispatchEvent(
            new StorageEvent('storage', { key: Token.ACCESS, newValue: access_token })
          );
          setRefreshToken(refresh_token);
          setUser(user);
        }
      });
    },
    [loginMutation, setAccessToken, setRefreshToken]
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken]);

  const value = useMemo(() => {
    return {
      login,
      logout,
      user
    };
  }, [login, logout, user]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
