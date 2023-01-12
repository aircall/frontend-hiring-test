import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  fromPromise
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthProvider } from './hooks/useAuth';
import { REFRESH_TOKEN } from './gql/mutations';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

const httpLink = createHttpLink({ uri: `${process.env.REACT_APP_API_URL}` });

const getRefreshedToken = () => {
  const accessToken = window.localStorage.getItem('refresh_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  return accessToken ? `Bearer ${parsedToken}` : '';
};

let refreshingToken = '';

const getNewToken = async () => {
  const refreshedToken = getRefreshedToken();
  if (refreshingToken === refreshedToken) {
    return Promise.reject('Got in a loop refreshing same expired token');
  }

  refreshingToken = refreshedToken;

  const refreshToken = window.localStorage.getItem('refresh_token') || '';
  window.localStorage.setItem('access_token', refreshToken);

  const {
    data: { refreshTokenV2 }
  } = await client.mutate({
    mutation: REFRESH_TOKEN
  });

  const accessToken = refreshTokenV2.access_token;
  window.localStorage.setItem('access_token', JSON.stringify(accessToken));
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { exception } = error.extensions as { exception: { status: number } };
      if (exception.status === 401) {
        return fromPromise(
          getNewToken().catch(() => {
            localStorage.clear();
            window.location.reload();
          })
        ).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = window.localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include'
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
