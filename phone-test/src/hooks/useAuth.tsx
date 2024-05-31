import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { FetchResult, useMutation } from '@apollo/client';

interface User {
  username: string;
}
enum Status {
  loading = 'loading',
  authenticated = 'authenticated',
  unauthenticated = 'unauthenticated'
}

interface AuthContextProps {
  user: User | null;
  status: Status;
  accessToken: string | null;
  refreshToken: string | null;
  login: ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => Promise<FetchResult<any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  status: Status.loading,
  accessToken: null,
  refreshToken: null,
  login: ({ username, password }: { username: string; password: string }) =>
    Promise.resolve({} as FetchResult<any>),
  logout: () => {}
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>(Status.loading);
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = ({ username, password }: { username: string; password: string }) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({
        login
      }: {
        login: {
          access_token: string;
          refresh_token: string;
          user: User;
        };
      }) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        setStatus(Status.authenticated);
        navigate('/calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setStatus(Status.unauthenticated);
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => {
    return {
      login,
      logout,
      status,
      user,
      accessToken,
      refreshToken
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
