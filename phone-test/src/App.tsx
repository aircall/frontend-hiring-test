import { Tractor } from '@aircall/tractor';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  fromPromise
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';

import './App.css';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { GlobalAppStyle } from './style/global';
import { AuthProvider } from './hooks/useAuth';
import { REFRESH_TOKEN } from './gql/mutations';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

const getNewAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('Cannot get new access_token because refresh_token is missing');
  }

  // Set the refresh_token as access_token
  // so that it is used as Authorization header during the mutation
  localStorage.setItem('access_token', refreshToken);
  const {
    data: { refreshTokenV2 }
  } = await client.mutate({ mutation: REFRESH_TOKEN });
  return refreshTokenV2.access_token;
};

const errorLink = onError(({ forward, graphQLErrors, operation }) => {
  if (graphQLErrors) {
    const hasUnauthorizedError = graphQLErrors.some(error => {
      const { status } = error.extensions.exception as { status: number };
      return status === 401;
    });
    if (hasUnauthorizedError) {
      return fromPromise(
        getNewAccessToken().catch(() => {
          // If the token refresh fails,
          // clear LocalStorage and redirect to login page
          localStorage.clear();
          window.location.href = '/login';
        })
      )
        .filter(value => Boolean(value))
        .flatMap(accessToken => {
          localStorage.setItem('access_token', JSON.stringify(accessToken));
          operation.setContext({
            headers: {
              ...operation.getContext().headers,
              authorization: `Bearer ${accessToken}`
            }
          });
          return forward(operation);
        });
    }
  }
});

const links = [authLink, errorLink, httpLink];
const client = new ApolloClient({
  link: ApolloLink.from(links),
  cache: new InMemoryCache()
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
