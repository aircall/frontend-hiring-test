import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN, REFRESH_TOKEN_V2 } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import useApolloClient from './useApolloClient';
import generateApolloClient from '../services/apollo/apolloClient';
import { AUTH_CONFIG } from '../services/auth/authConfig';

interface AuthContextInterface {
  login: (credentials: { username: string; password: string }) => void;
  logout: () => void;
  checkIsLoggedIn: () => boolean;
  user: UserType | undefined;
}

const AuthContext = createContext<AuthContextInterface>({
  login: (credentials: { username: string; password: string }) => {},
  logout: () => {},
  checkIsLoggedIn: () => false,
  user: undefined
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const navigate = useNavigate();
  const { setApolloClient } = useApolloClient();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useLocalStorage(AUTH_CONFIG.USER, undefined);
  const [accessToken, setAccessToken] = useLocalStorage(AUTH_CONFIG.AUTH_TOKEN_KEY, undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage(AUTH_CONFIG.REFRESH_TOKEN_KEY, undefined);
  const [loginMutation] = useMutation(LOGIN);
  const [refreshAuthTokenMutation] = useMutation(REFRESH_TOKEN_V2, {
    client: generateApolloClient(AUTH_CONFIG.REFRESH_TOKEN_KEY)
  });

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: { username: string; password: string }) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: { login: Record<PropertyKey, unknown> }) => {
          const { access_token, refresh_token, user } = login;
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          setUser(user);
          setIsLoggedIn(true);
          console.log('redirect to calls');
          navigate('/calls');
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken, setUser]
  );

  // call this function to refresh the authToken
  const refreshAuthToken = useCallback(() => {
    return refreshAuthTokenMutation({
      onCompleted: ({ refreshTokenV2 }: { refreshTokenV2: Record<PropertyKey, unknown> }) => {
        const { access_token, refresh_token } = refreshTokenV2;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setApolloClient(generateApolloClient(AUTH_CONFIG.REFRESH_TOKEN_KEY));
        console.log('auth token refresh');
      }
    });
  }, [refreshAuthTokenMutation, setAccessToken, setApolloClient, setRefreshToken]);

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken, setUser, setIsLoggedIn]);

  const isExpiredToken = (token: string): boolean => {
    if (typeof token !== 'string') return true;

    const tokenChunks = token.split('.');
    const [, rawExpiration] = tokenChunks;

    const decodedJWTToken = JSON.parse(window.atob(rawExpiration));
    return Date.now() > decodedJWTToken.exp * 1000;
  };

  const checkAuthToken = useCallback(() => {
    console.log('checkAuthToken triggered');
    const isAuthTokenExpired = isExpiredToken(localStorage.getItem(AUTH_CONFIG.AUTH_TOKEN_KEY)!);
    const isRefreshTokenExpired = isExpiredToken(
      localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)!
    );

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

  const checkIsLoggedIn = useCallback((): boolean => {
    return (
      !!localStorage.getItem(AUTH_CONFIG.USER) &&
      !!localStorage.getItem(AUTH_CONFIG.AUTH_TOKEN_KEY) &&
      !!localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
    );
  }, []);

  const value = useMemo(() => {
    return {
      login,
      logout,
      checkIsLoggedIn,
      user
    };
  }, [login, logout, user, checkIsLoggedIn]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (isLoggedIn) {
      intervalId = setInterval(checkAuthToken, AUTH_CONFIG.CHECK_AUTH_TOKEN_FREQUENCY);
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
