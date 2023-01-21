import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  fromPromise,
  split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { REFRESH_TOKEN } from './mutations';

// Get the authentication token from local storage if it exists
const getToken = () => {
  const accessToken = localStorage.getItem('access_token');
  return accessToken ? JSON.parse(accessToken) : undefined;
};

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const subscriptionClient = new SubscriptionClient('wss://frontend-test-api.aircall.dev/websocket', {
  reconnect: true,
  connectionParams: async () => {
    const token = getToken();
    return {
      authorization: token ? `Bearer ${token}` : ''
    };
  }
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

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
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

const links = [authLink, errorLink, splitLink];

const client = new ApolloClient({
  link: ApolloLink.from(links),
  cache: new InMemoryCache()
});

export default client;
