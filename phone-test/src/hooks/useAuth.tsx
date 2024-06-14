import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';
import { AuthenticationStatus } from '../declarations/enums';

interface AuthContextType {
  login: (credentials: { username: string; password: string }) => void;
  logout: () => void;
  user: any;
  status: AuthenticationStatus;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState<AuthenticationStatus>(AuthenticationStatus.Loading);
  const [accessToken, setAccessToken] = useLocalStorage('access_token', null);
  const [, setRefreshToken] = useLocalStorage('refresh_token', null);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setStatus(AuthenticationStatus.Authenticated);
    } else {
      setStatus(AuthenticationStatus.Unauthenticated);
    }
  }, [accessToken]);

  // call this function when you want to authenticate the user
  const login = ({ username, password }: { username: string; password: string }) => {
    setStatus(AuthenticationStatus.Loading);
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        setStatus(AuthenticationStatus.Authenticated);
        navigate('/calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setStatus(AuthenticationStatus.Unauthenticated);
    navigate('/login', { replace: true });
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      user,
      status
    }),
    [user, status]
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Hook should be called within AuthProvider');
  }
  return context;
};
