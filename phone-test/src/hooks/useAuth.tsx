import { createContext, useContext, useState, useEffect } from 'react';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { ME } from '../gql/queries';
import { REFRESH_TOKEN_V2 } from '../gql/mutations/refreshTokenV2';

interface Credentials {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
  };
}

interface AuthContextValue {
  accessToken?: string;
  getNewAccessToken: () => Promise<FetchResult<any>>;
  login: (credentials: { username: string; password: string }) => Promise<FetchResult<any>>;
  logout: VoidFunction;
  refreshToken?: string;
  user?: Credentials['user'];
}

const authContextInitialValue: AuthContextValue = {
  accessToken: '',
  getNewAccessToken: () => Promise.resolve({}),
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
  const [user, setUser] = useState<Credentials['user']>();
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation<
    { login: Credentials },
    { input: { username: string; password: string } }
  >(LOGIN);
  const [refreshTokenMutation] = useMutation<
    { refreshTokenV2: Credentials },
    { input: { refresh_token: string } }
  >(REFRESH_TOKEN_V2);
  const { data } = useQuery(ME, { skip: !accessToken });

  const setCredentials = ({ access_token, refresh_token, user }: Credentials) => {
    console.log('setCredentials', { access_token, refresh_token, user });
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setUser(user);
  };

  const login = ({ username, password }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }) => {
        setCredentials(login);
      }
    });
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  const getNewAccessToken = async () => {
    return refreshTokenMutation({
      onCompleted: ({ refreshTokenV2 }) => {
        setCredentials(refreshTokenV2);
      }
    });
  };

  useEffect(() => {
    if (data?.me) setUser(data.me);
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        getNewAccessToken,
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
