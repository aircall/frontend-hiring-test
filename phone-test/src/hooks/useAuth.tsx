import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

const AuthContext = createContext({
  login: ({}) => {},
  logout: () => {},
  user: null,
  status: 'idle',
  accessToken: null,
  refreshToken: null,
  mounted: false
});

export const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', null);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', null);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);

  console.log(111, accessToken);

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
          setStatus('completed');
          navigate('/calls');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken, setUser]
  );

  // call this function to sign out logged-in user
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken, setUser]);

  const value = useMemo(() => {
    return {
      login,
      logout,
      user,
      status,
      accessToken,
      refreshToken,
      mounted
    };
  }, [login, logout, user, status, accessToken, refreshToken, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
