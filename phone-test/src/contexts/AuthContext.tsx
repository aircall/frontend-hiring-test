import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMutation, useQuery } from '@apollo/client';
import { Outlet, useNavigate } from 'react-router-dom';
import { LoginInput } from 'declarations/auth';
import { LOGIN } from 'gql/mutations';
import type { AuthContextType, State } from './AuthContext.d';
import authReducer from 'reducers/authReducer';
import { USER_ME } from 'gql/queries/user';

const defaultState: State = {
  user: null,
  status: 'Loading'
};

const AuthContext = createContext<AuthContextType>({
  ...defaultState,
  login: (loginInput: LoginInput) => {},
  logout: () => {}
});

export const AuthProvider = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, defaultState);

  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);

  const [loginMutation] = useMutation(LOGIN);
  const { loading, error, data } = useQuery(USER_ME);

  const { me: user } = data || {};

  // There is no "accessToken" in dependency array because I only want to set the status at the beginning
  useEffect(() => {
    if (!accessToken) {
       dispatch({ type: 'STATUS', payload: { status: 'Idle' } });
      console.log('No access token');
      return;
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (error) {
      dispatch({ type: 'STATUS', payload: { status: 'Idle' } });
      if (accessToken) {
        setAccessToken(undefined);
      }
      if (refreshToken) {
        setRefreshToken(undefined);
      }
    }

    if (user?.username) {
      dispatch({ type: 'LOGIN', payload: { user: user.username } });
      if (window.location.pathname === '/login') navigate('/calls');
    }
  }, [user, loading, error, accessToken, setAccessToken, setRefreshToken, navigate, refreshToken]);

  // call this function when you want to authenticate the user
  const login = useCallback(
    ({ username, password }: LoginInput) => {
      dispatch({ type: 'STATUS', payload: { status: 'Loading' } });

      return loginMutation({
        variables: { input: { username, password } },
        onCompleted: ({ login }: any) => {
          const { access_token, refresh_token, user } = login;
          dispatch({ type: 'LOGIN', payload: { user: user.username } });
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          navigate('/calls');
        },
        onError: (error: any) => {
          dispatch({ type: 'STATUS', payload: { status: 'Error' } });
        }
      });
    },
    [loginMutation, navigate, setAccessToken, setRefreshToken]
  );

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    console.log('logout');
    setAccessToken(undefined);
    setRefreshToken(undefined);
    dispatch({ type: 'LOGOUT' });
    navigate('/login', { replace: true });
  }, [navigate, setAccessToken, setRefreshToken]);

  const value = useMemo(() => {
    return {
      ...state,
      login,
      logout
    };
  }, [login, logout, state]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthContext;
