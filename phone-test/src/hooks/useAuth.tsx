import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { ApolloClient, NormalizedCacheObject, useMutation } from '@apollo/client';
import { AppStatus, Constants } from '../constants/constants';
import AuthService from '../services/auth.services';

const AuthContext = createContext({
  login: ({ }) => { },
  logout: () => { },
  isAuth: () => Boolean(false),
  user:  { } as UserType
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  // this is when user refresh the page, if we don't want to use local storage for the current user we can refactor using the endpoint "me"
  const [userStorage, setUserStorage] = useLocalStorage('current_user', undefined);
  const [user, setUser] = useState(userStorage);
  // const [status, setStatus] = useState(AppStatus.LOADING);
  const [tokenExpiration, setTokenExpiration] = useLocalStorage('token_expiration', undefined);
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = ({ username, password }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        const expirationToken = new Date(new Date().getTime() + Constants.tokenExpirationMinutes * 60000);
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        setUserStorage(user);
        setTokenExpiration(expirationToken)
        // setStatus(AppStatus.LOADED)
        console.log('redirect to calls');
        window.document.location.href = '/calls';
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  };

  // Returns true if user is authenticated 
  const isAuth = () : boolean => {
    if (localStorage.getItem('access_token') != null && localStorage.getItem('access_token') != undefined) {
      return true;
    }
    return false;
  };


  const value = useMemo(() => {
    return {
      login,
      logout,
      isAuth,
      user,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
