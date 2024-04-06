import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  SetStateAction,
  useEffect
} from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN, REFRESH_TOKEN_V2 } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import useApolloClient from './useApolloClient';
import { useMutation } from '@apollo/client';

// Interval frequency in ms...
// TODO: (Suggestion) We could move this to an environment variable...
const CHECK_AUTH_TOKEN_FREQUENCY = 60000;

const AuthContext = createContext({
  login: (credentials: { username: string; password: string }) => {},
  logout: () => {}
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const { generateApolloClient } = useApolloClient();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState();
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const [refreshAuthTokenMutation] = useMutation(REFRESH_TOKEN_V2, {
    client: generateApolloClient('refresh_token')
  });
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: { username: string; password: string }) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: { login: Record<PropertyKey, unknown> }) => {
          const { access_token, refresh_token, user } = login;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setUser(user as SetStateAction<undefined>);
          setIsLoggedIn(true);
          console.log('redirect to calls');
          navigate('/calls');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken]
  );

  // call this function to refresh the authToken
  const refreshAuthToken = useCallback(() => {
    return refreshAuthTokenMutation({
      onCompleted: ({ refreshTokenV2 }: { refreshTokenV2: Record<PropertyKey, unknown> }) => {
        const { access_token, refresh_token } = refreshTokenV2;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        console.log('auth token refresh');
      }
    });
  }, [refreshAuthTokenMutation, setAccessToken, setRefreshToken]);

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken]);

  const isExpiredToken = (token: string): boolean => {
    if (typeof token !== 'string') return true;

    const tokenChunks = token.split('.');
    const [, rawExpiration] = tokenChunks;

    const decodedJWTToken = JSON.parse(window.atob(rawExpiration));
    return Date.now() > decodedJWTToken.exp * 1000;
  };

  const checkAuthToken = useCallback(() => {
    console.log('checkAuthToken triggered');
    const isAuthTokenExpired = isExpiredToken(localStorage.getItem('access_token')!);
    const isRefreshTokenExpired = isExpiredToken(localStorage.getItem('refresh_token')!);

    const shouldRefreshToken = isAuthTokenExpired && !isRefreshTokenExpired;
    const shouldLogout = isAuthTokenExpired && isRefreshTokenExpired;

    if (shouldRefreshToken) {
      refreshAuthToken();
    } else if (shouldLogout) {
      logout();
    } else {
      return;
    }
  }, [logout, refreshAuthToken]);

  const value = useMemo(() => {
    return {
      login,
      logout
    };
  }, [login, logout]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isLoggedIn) {
      intervalId = setInterval(checkAuthToken, CHECK_AUTH_TOKEN_FREQUENCY);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isLoggedIn, checkAuthToken]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
