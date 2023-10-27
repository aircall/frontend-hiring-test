import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

const uri = 'https://frontend-test-api.aircall.dev/graphql';
const url = 'wss://frontend-test-api.aircall.dev/websocket';

const accessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : '';
  return `Bearer ${parsedToken}`;
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: accessToken()
    }
  };
});

const httpLink = createHttpLink({ uri });

const wsLink = new WebSocketLink(
  new SubscriptionClient(url, {
    connectionParams: {
      headers: {
        authorization: accessToken()
      }
    }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});
