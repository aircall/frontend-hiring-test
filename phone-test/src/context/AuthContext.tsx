import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOGIN } from '../gql/mutations';
import { AuthContextProps } from '../declarations/auth';
import { ME } from '../gql/queries/me';

enum Status {
  loading = 'loading',
  authenticated = 'authenticated',
  unauthenticated = 'unauthenticated'
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

export const AuthProvider = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [status, setStatus] = useState<Status>(Status.loading);
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const { loading, error, data } = useQuery(ME);
  const { me } = data || {};

  useEffect(() => {
    if (!loading && !error && me?.username) {
      setUser(me);
    }
  }, [me, loading, error]);

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
          user: UserType;
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
export default AuthContext;
