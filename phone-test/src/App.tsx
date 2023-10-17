import { Tractor } from '@aircall/tractor';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { refreshToken, getAccessToken } from './auth/token';
import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import './App.css';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client';
import router from './routes';
import { fromPromise } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({ 
  uri: 'https://frontend-test-api.aircall.dev/graphql'
 });

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getAccessToken()
  }
}));

// refreshUnauth func to refresh token in case of unauthorized
const refreshUnauth = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { exception } = error.extensions as { exception: { status: number } };
      if (exception.status === 401) {
        return fromPromise(refreshToken()).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

const subscriptionClient = new SubscriptionClient('wss://frontend-test-api.aircall.dev/websocket', {
  lazy: true,
  reconnect: true,
  connectionParams: async () =>
    await refreshToken().then(() => {
      return {
        authorization: getAccessToken()
      };
    }),
  timeout: 60000 //change this to pass delay in refresh tocken interval
});

const wsLink = new WebSocketLink(subscriptionClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: refreshUnauth.concat(authLink).concat(splitLink),
  cache: new InMemoryCache()
});

const App = () => {
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
