import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';
import { useRefValue } from './useRefValue';

type LoginParam = {
  username: string;
  password: string;
};

type AuthContextType = {
  login: (args: LoginParam) => unknown;
  logout: () => unknown;
  user: AuthResponseType['user'] | null;
  status: LoggingInState;
};

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  user: null,
  status: 'loading'
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  // const [user, setUser] = useState<AuthResponseType['user'] | null>(null);
  const { state } = useLocation();
  const [accessToken, setAccessToken] = useLocalStorage<string>('access_token', null);
  const [refreshToken, setRefreshToken] = useLocalStorage<string>('refresh_token', null);
  const [user, setUser] = useLocalStorage<AuthResponseType['user']>('user', null);
  const [status, setStatus] = useState<LoggingInState>(
    accessToken && refreshToken && user ? 'done' : 'loading'
  );
  const [loginMutation] = useMutation<{ login: AuthResponseType }, { input: LoginInput }>(LOGIN);
  const navigate = useNavigate();
  const stateRef = useRefValue(state);

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: LoginParam) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }) => {
          const { access_token, refresh_token, user } = login;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setUser(user);
          setStatus('done');
          const redirectTo =
            typeof stateRef.current?.redirectTo === 'string'
              ? stateRef.current.redirectTo
              : '/calls';
          console.log('redirect to ' + redirectTo);
          navigate(redirectTo, {
            replace: true
          });
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken, setUser, stateRef]
  );

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate('/', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken, setUser]);

  const value = useMemo(() => {
    return {
      login,
      logout,
      user,
      status
    };
  }, [login, logout, user, status]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
