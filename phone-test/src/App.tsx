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
  ApolloLink,
  Observable,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  FetchResult
} from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from './gql/mutations/refreshToken';
import { GraphQLError } from 'graphql';
import { AppRedirect } from './AppRedirect';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('access_token');
  let token = accessToken || undefined;

  if (operation.operationName === 'refreshTokenV2') {
    const refreshToken = localStorage.getItem('refresh_token');
    token = refreshToken || undefined;
  }

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${JSON.parse(token)}` : ''
    }
  });

  return forward(operation);
});

const refreshToken = async () => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN
    });
    const accessToken = data?.refreshTokenV2.access_token;
    if (!accessToken) {
      throw new GraphQLError('Empty AccessToken');
    }

    localStorage.setItem('access_token', JSON.stringify(accessToken));
    return accessToken;
  } catch (err) {
    localStorage.clear();
    throw err;
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.message) {
        case 'Unauthorized':
          // ignore 401 error for a refresh request
          if (operation.operationName === 'refreshTokenV2') return;

          const observable = new Observable<FetchResult<Record<string, any>>>(observer => {
            // used an annonymous function for using an async function
            (async () => {
              try {
                const accessToken = await refreshToken();

                operation.setContext({
                  headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${accessToken}`
                  }
                });

                // Retry the failed request
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                };

                forward(operation).subscribe(subscriber);
              } catch (err) {
                observer.error(err);
              }
            })();
          });

          return observable;
      }
    }
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache()
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/" element={<AppRedirect />} />
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
