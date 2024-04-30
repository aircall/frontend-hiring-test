// import { createContext, useContext, useMemo, useState } from 'react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
// import { useMutation } from '@apollo/client';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { GET_USER } from '../gql/queries/';
// import tokenStorage from '../helpers/tokenStorage';
import tokenStorage from '../gql/client';


type Credentials = {
  username: string;
  password: string;
};

type ProviderType = {
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
  error?: ApolloError;
};


const defaultState: ProviderType = {
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  user: null,
  loading: false
};

const AuthContext = createContext(defaultState);

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

// const AuthContext = createContext({
//   login: ({}) => {},
//   logout: () => {}
// });

// export interface AuthPRoviderProps {
//   children: React.ReactNode;
// }

export const AuthProvider = () => {

    const [user, setUser] = useState<UserType | null>(null);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();
  const [getUser, { loading, error, data }] = useLazyQuery(GET_USER);
  const isAuthenticated = !!tokenStorage.getAccessToken();

  // get user data at first render if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, []);

  // set user data if there is no error fetching user data
  useEffect(() => {
    if (data) {
      setUser(data.me);
    }
  }, [data]);

  // log out user if there is an error fetching user data
  useEffect(() => {
    if (error) {
      console.log(error);
      logout();
    }
  }, [error]);

  // call this function when you want to authenticate the user
  const login = ({ username, password }: Credentials) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        tokenStorage.setAccessToken(access_token);
        tokenStorage.setRefreshToken(refresh_token);
        setUser(user);
        console.log('redirect to calls');
        navigate('/calls');
      }
    });
  };

  // const [user, setUser] = useState();
  // const [status, setStatus] = useState('loading');
  // const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  // const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  // // using this to persist the user name for displaying in interface
  // const [loggedInUser, setLoggedInUser] = useLocalStorage('logged_in_user', undefined);
  // const [loginMutation] = useMutation(LOGIN);
  // const navigate = useNavigate();

  // // call this function when you want to authenticate the user
  // const login = ({ username, password }: any) => {
  //   return loginMutation({
  //     variables: { input: { username, password } },
  //     onCompleted: ({ login }: any) => {
  //       const { access_token, refresh_token, user } = login;
  //       setAccessToken(access_token);
  //       setRefreshToken(refresh_token);
  //       setLoggedInUser(user);
  //       setUser(user);
  //       // store user in storage
  //       console.log('redirect to calls');
  //       navigate('/calls');
  //     }
  //   });
  // };

  // call this function to sign out logged in user
  // const logout = () => {
  //   setAccessToken(null);
  //   setRefreshToken(null);
  //   navigate('/login', { replace: true });
  // };

  // const value = useMemo(() => ({ login, logout }), []);

    // call this function to sign out logged in user
  const logout = () => {
    tokenStorage.setAccessToken(null);
    tokenStorage.setRefreshToken(null);
    setUser(null);
    navigate('/login');
  };

    const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      user,
      loading
    }),
    [user, loading, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};



// import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { LOGIN } from '../gql/mutations';
// import { GET_USER } from '../gql/queries/';
// import tokenStorage from '../helpers/tokenStorage';

// type Credentials = {
//   username: string;
//   password: string;
// };

// type ProviderType = {
//   login: (credentials: Credentials) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
//   user: UserType | null;
//   loading: boolean;
//   error?: ApolloError;
// };

// const defaultState: ProviderType = {
//   login: () => {},
//   logout: () => {},
//   isAuthenticated: false,
//   user: null,
//   loading: false
// };

// const AuthContext = createContext(defaultState);

// export interface AuthPRoviderProps {
//   children: React.ReactNode;
// }

// export const AuthProvider = () => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [loginMutation] = useMutation(LOGIN);
//   const navigate = useNavigate();
//   const [getUser, { loading, error, data }] = useLazyQuery(GET_USER);
//   const isAuthenticated = !!tokenStorage.getAccessToken();

//   // get user data at first render if user is authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       getUser();
//     }
//   }, []);

//   // set user data if there is no error fetching user data
//   useEffect(() => {
//     if (data) {
//       setUser(data.me);
//     }
//   }, [data]);

//   // log out user if there is an error fetching user data
//   useEffect(() => {
//     if (error) {
//       console.log(error);
//       logout();
//     }
//   }, [error]);

//   // call this function when you want to authenticate the user
//   const login = ({ username, password }: Credentials) => {
//     return loginMutation({
//       variables: { input: { username, password } },
//       onCompleted: ({ login }: any) => {
//         const { access_token, refresh_token, user } = login;
//         tokenStorage.setAccessToken(access_token);
//         tokenStorage.setRefreshToken(refresh_token);
//         setUser(user);
//         console.log('redirect to calls');
//         navigate('/calls');
//       }
//     });
//   };

//   // call this function to sign out logged in user
//   const logout = () => {
//     tokenStorage.setAccessToken(null);
//     tokenStorage.setRefreshToken(null);
//     setUser(null);
//     navigate('/login');
//   };

//   const value = useMemo(
//     () => ({
//       login,
//       logout,
//       isAuthenticated,
//       user,
//       loading
//     }),
//     [user, loading, isAuthenticated]
//   );

//   return (
//     <AuthContext.Provider value={value}>
//       <Outlet />
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
