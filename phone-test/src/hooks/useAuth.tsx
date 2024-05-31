import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

interface User {
  username: string;
}

const AuthContext = createContext({
  login: ({}) => {},
  logout: () => {}
});

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [user, setUser] = useState<User | null>();
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/calls');
    } else {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  // call this function when you want to authenticate the user
  const login = ({ username, password }: any) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({
        login
      }: {
        login: {
          access_token: string;
          refresh_token: string;
          user: User;
        };
      }) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        console.log('redirect to calls');
        navigate('/calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login', { replace: true });
  };

  const value = useMemo(() => {
    return {
      login,
      logout
    };
  }, []);
  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
