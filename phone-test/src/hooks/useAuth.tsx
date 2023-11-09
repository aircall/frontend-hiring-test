import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN, LOGIN_DATA, LOGIN_VARIABLES } from '../gql/mutations';
import { useApolloClient, useMutation } from '@apollo/client';
import { addOrRemoveLocalStorageItem, getLocalStorageItem } from '../helpers/localStorage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/localStorageKeys';
import { PATHS } from '../constants/paths';

interface AuthContextValue {
  login: ({ username, password }: LoginInput) => void;
  logout: () => void;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const client = useApolloClient();

  const [status, setStatus] = useState<AuthContextValue['status']>('loading');

  const [loginMutation] = useMutation<LOGIN_DATA, LOGIN_VARIABLES>(LOGIN);

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: LoginInput) => {
      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }) => {
          const { access_token, refresh_token } = login;

          addOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY, access_token);
          addOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY, refresh_token);

          setStatus('authenticated');

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

    await client.clearStore();

    setStatus('unauthenticated');

    navigate(PATHS.LOGIN, { replace: true });
  }, [navigate, client]);

  useEffect(
    function checkIfUserIsAuthenticated() {
      if (status === 'loading') {
        const accessToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

        setStatus(accessToken ? 'authenticated' : 'unauthenticated');
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
