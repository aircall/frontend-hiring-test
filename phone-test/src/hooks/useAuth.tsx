import { createContext, useCallback, useContext, useMemo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN, LOGIN_DATA, LOGIN_VARIABLES } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useApolloClient, useMutation } from '@apollo/client';

interface AuthContextValue {
  login: ({ username, password }: LoginInput) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const client = useApolloClient();

  // const [status, setStatus] = useState('loading');

  const [, setAccessToken] = useLocalStorage('access_token', undefined);
  const [, setRefreshToken] = useLocalStorage('refresh_token', undefined);

  const [loginMutation] = useMutation<LOGIN_DATA, LOGIN_VARIABLES>(LOGIN);

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: LoginInput) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }) => {
          const { access_token, refresh_token } = login;

          setAccessToken(access_token);
          setRefreshToken(refresh_token);

          navigate('/calls');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken]
  );

  // call this function to sign out logged in user
  const logout = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);

    await client.clearStore();

    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken, client]);

  const value = useMemo(() => {
    return {
      login,
      logout
    };
  }, [login, logout]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthContext');
  }

  return context;
};
