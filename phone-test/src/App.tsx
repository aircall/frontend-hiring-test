import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/List/CallsList';
import { CallDetailsPage } from './pages/CallDetails/CallDetails';
import { Tractor } from '@aircall/tractor';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

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
  GraphQLRequest,
  Observable,
  FetchResult,
  ApolloLink,
  split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthProvider } from './hooks/useAuth';
import { LogoutPage } from './pages/Logout/Logout';
import { GraphQLError } from 'graphql';
import { REFRESH_TOKEN } from './gql/mutations';
import { getStorageItem, setStorageItem } from './helpers/storage';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

function isRefreshRequest(operation: GraphQLRequest) {
  return operation.operationName === 'refreshToken';
}

function returnTokenDependingOnOperation(operation: GraphQLRequest) {
  if (isRefreshRequest(operation)) return getStorageItem<string>('refresh_token')[0];
  else return getStorageItem<string>('access_token')[0];
}

const authLink = setContext((operation, { headers }) => {
  const token = returnTokenDependingOnOperation(operation);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined
    }
  };
});

const refreshToken = async () => {
  try {
    const { data } = await client.mutate<{
      refreshTokenV2: AuthResponseType;
    }>({
      mutation: REFRESH_TOKEN
    });

    const accessToken = data?.refreshTokenV2.access_token;

    if (data) {
      const refreshToken = data?.refreshTokenV2.refresh_token;
      const user = data?.refreshTokenV2.user;
      setStorageItem('access_token', accessToken ?? '');
      setStorageItem('refresh_token', refreshToken);
      setStorageItem('user', user);
    }

    return accessToken;
  } catch (err) {
    localStorage.clear();
    throw err;
  }
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthProvider />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/calls" element={<ProtectedLayout />}>
          <Route path="/calls" element={<CallsListPage />} />
          <Route path="/calls/:callId" element={<CallDetailsPage />} />
        </Route>
      </Route>
    </>
  )
);

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    const errorToHandle = graphQLErrors
      .filter(error => error.extensions.code === 'INTERNAL_SERVER_ERROR')
      .at(0);

    const observableToReturn = errorToHandle
      ? () => {
          if (operation.operationName === 'refreshToken') return undefined;

          const observable = new Observable<FetchResult<Record<string, unknown>>>(observer => {
            (async () => {
              try {
                const accessToken = await refreshToken();

                if (!accessToken) {
                  throw new GraphQLError('no access token');
                }

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                };

                forward(operation).subscribe(subscriber);
              } catch (err) {
                observer.error(err);
                router.navigate('/login', {
                  replace: true
                });
              }
            })();
          });

          return observable;
        }
      : undefined;

    return observableToReturn?.();
  }
});

const wsClient = new SubscriptionClient(`wss://frontend-test-api.aircall.dev/websocket`, {
  reconnect: true,
  connectionParams: () => {
    const token = getStorageItem<string>('access_token')[0];
    return {
      authorization: token ? `Bearer ${token}` : undefined
    };
  }
});

const wsLink = new WebSocketLink(wsClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache({
    resultCaching: false
  })
});

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
