import { createContext, useContext, useState, useEffect } from 'react';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { ME } from '../gql/queries';

interface AuthContextValue {
  accessToken?: string;
  login: (credentials: { username: string; password: string }) => Promise<FetchResult<any>>;
  logout: VoidFunction;
  refreshToken?: string;
  user?: {
    id: string;
    username: string;
  };
}

const authContextInitialValue: AuthContextValue = {
  accessToken: '',
  login: credentials => Promise.resolve({}),
  logout: () => undefined,
  refreshToken: '',
  user: undefined
};

const AuthContext = createContext<AuthContextValue>(authContextInitialValue);

interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthPRoviderProps) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const { data } = useQuery(ME, { skip: !accessToken });

  const login = ({ username, password }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
      }
    });
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    if (data?.me) setUser(data.me);
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
        refreshToken,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
