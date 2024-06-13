import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';

import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './hooks/useAuth';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
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

// Detect if the user is not authorized and redirect to login page for every request
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
    // Check if the user is not authorized and redirect to login page
    graphQLErrors.some(({ message }) => {
      if (message === 'Unauthorized') {
        window.location.href = '/login?sessionExpired=true';
        return true;
      }
      return false;
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const wsLink = new WebSocketLink(
  new SubscriptionClient('wss://frontend-test-api.aircall.dev/websocket', {
    connectionParams: () => {
      const accessToken = localStorage.getItem('access_token');
      const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;
      return {
        authorization: accessToken ? `Bearer ${parsedToken}` : ''
      };
    }
  })
);

// Split link to send data to each link depending on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache()
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/" element={<Navigate to="/calls" />} />
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
