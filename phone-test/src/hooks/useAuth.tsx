import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

const AuthContext = createContext({
  login: ({ username, password }: { username: string; password: string }) => {},
  logout: () => {},
  isAuthenticated: () => Boolean(false)
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [user, setUser] = useState();
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = ({ username, password }: { username: string; password: string }) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        console.log('redirect to calls');
        navigate('/calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  };

  /**
   * Check if user is currently authenticated.
   */
  const isAuthenticated = () => {
    return !!window.localStorage.getItem('access_token');
  };

  const value = useMemo(() => {
    return {
      login,
      logout,
      isAuthenticated
    };
  }, []);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
