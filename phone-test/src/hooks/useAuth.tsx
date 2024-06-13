import { createContext, useCallback, useContext, useMemo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

// Define the context value type
interface AuthContextType {
  login: ({ username, password }: any) => Promise<any>;
  logout: () => void;
}

// Create the AuthContext with the correct initial value
const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = () => {
  const [, setAccessToken] = useLocalStorage('access_token', undefined);
  const [, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: any) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: any) => {
          const { access_token, refresh_token } = login;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          navigate('/calls');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken]
  );

  // call this function to sign out logged-in user
  const logout = useCallback(() => {
    setAccessToken(undefined);
    setRefreshToken(undefined);
    navigate('/login', { replace: true });
  }, [setAccessToken, setRefreshToken, navigate]);

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

export const useAuth = () => useContext(AuthContext);
