import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN, LOGIN_DATA, LOGIN_VARIABLES } from '../../gql/mutations';
import { useMutation } from '@apollo/client';
import { addOrRemoveLocalStorageItem, getLocalStorageItem } from '../../helpers/localStorage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constants/localStorageKeys';
import { PATHS } from '../../constants/paths';
import { AuthContextValue, AuthenticationStatus } from './index.decl';
import {
  clearApolloClientCacheOnLogout,
  resetApolloClientLinksOnAuthorizationTokensChange
} from '../../ApolloClientProvider/client';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = () => {
  const [status, setStatus] = useState<AuthContextValue['status']>(
    AuthenticationStatus.INITIAL_LOADING
  );

  const [loginMutation] = useMutation<LOGIN_DATA, LOGIN_VARIABLES>(LOGIN);

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: LoginInput) => {
      setStatus(AuthenticationStatus.AUTHENTICATING);

      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }) => {
          const { access_token, refresh_token } = login;

          addOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY, access_token);
          addOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY, refresh_token);

          setStatus(AuthenticationStatus.LOGGED_IN);

          navigate(PATHS.CALLS);
        }
      });
    },
    [loginMutation, navigate]
  );

  // call this function to sign out logged in user
  const logout = useCallback(async () => {
    addOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY);
    addOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY);

    clearApolloClientCacheOnLogout();
    resetApolloClientLinksOnAuthorizationTokensChange();

    setStatus(AuthenticationStatus.NOT_LOGGED_IN);

    navigate(PATHS.LOGIN, { replace: true });
  }, [navigate]);

  useEffect(
    function checkAuthenticationStatusOnInit() {
      if (status === AuthenticationStatus.INITIAL_LOADING) {
        const accessToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

        setStatus(
          accessToken ? AuthenticationStatus.LOGGED_IN : AuthenticationStatus.NOT_LOGGED_IN
        );
      }
    },
    [status]
  );

  const value = useMemo(() => {
    return {
      login,
      logout,
      status
    };
  }, [login, logout, status]);

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
