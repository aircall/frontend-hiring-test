import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

interface LoginCredentials {
  username: string;
  password: string;
}
interface AuthContextObject {
  login: (credentials: LoginCredentials) => void;
  logout: (sessionExpired?: boolean) => void;
  accessToken: string;
  sessionExpired: boolean;
  user: {
    username: string;
    id: string;
  } | null;
}

export const AuthContext = createContext<AuthContextObject>({
  login: ({}) => {},
  logout: () => {},
  accessToken: '',
  sessionExpired: false,
  user: null
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthPRoviderProps) => {
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);

  // call this function when you want to authenticate the user
  const login = ({ username, password }: LoginCredentials) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setSessionExpired(false);
        setUser({ ...user });
        console.log('redirect to calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = (sessionExpired = false) => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setSessionExpired(sessionExpired);
  };

  const value = useMemo(() => {
    return {
      login,
      logout,
      accessToken,
      user,
      sessionExpired
    };
  }, [user, accessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
