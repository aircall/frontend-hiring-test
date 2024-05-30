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
  createHttpLink
} from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from './gql/mutations/refreshToken';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const accessToken = localStorage.getItem('access_token');
//   const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: accessToken ? `Bearer ${parsedToken}` : ''
//     }
//   };
// });

const authLink = new ApolloLink((operation, forward) => {
  // Use the setContext method to set the HTTP headers.
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  operation.setContext({
    headers: {
      authorization: `Bearer ${parsedToken} || ''}`
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // Check if the error was an authentication error

      if (err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        // Attempt to refresh the token
        return new Observable(observer => {
          client
            .mutate({ mutation: REFRESH_TOKEN })
            .then(({ data }) => {
              // Store the new tokens
              localStorage.setItem('access_token', data.refreshTokenV2.access_token);
              localStorage.setItem('refresh_token', data.refreshTokenV2.refresh_token);

              // Retry the request
              operation.setContext({
                headers: {
                  authorization: `Bearer ${data.refreshTokenV2.access_token}`
                }
              });
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              };

              // Retry the request
              forward(operation).subscribe(subscriber);
            })
            .catch(() => {
              return observer.error.bind(observer);
            });
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
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
