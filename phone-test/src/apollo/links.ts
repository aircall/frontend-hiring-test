import { Observable, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from '../gql/mutations';
import { GraphQLError } from 'graphql';
import client from './apolloClient';
import { addAuthHeader, clearTokens, isTokenRefreshing, saveTokens } from './utils';
import { HTTP_LINK, UNAUTHORIZED_MESSAGE, WS_LINK } from './constants';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

export const requestNewTokens = async () => {
  const { data } = await client.mutate({
    mutation: REFRESH_TOKEN
  });

  return data?.refreshTokenV2;
};

export const httpLink = createHttpLink({
  uri: HTTP_LINK
});

export const authLink = setContext((operation, { headers }) => {
  const { operationName } = operation;
  const token = isTokenRefreshing(operationName)
    ? localStorage.getItem('refresh_token')
    : localStorage.getItem('access_token');
  const parsedToken = token ? JSON.parse(token) : undefined;
  return addAuthHeader(parsedToken, headers);
});

export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      console.error('GraphQL Error:', error);
      if (error.message === UNAUTHORIZED_MESSAGE && !isTokenRefreshing(operation.operationName)) {
        return new Observable(observer => {
          (async () => {
            try {
              const tokenData = await requestNewTokens();
              if (!tokenData) {
                throw new GraphQLError('Auth Error');
              }

              const { access_token, refresh_token } = tokenData;
              forceReconnectWS();
              saveTokens(access_token, refresh_token);

              const headers = operation.getContext().headers ?? {};
              operation.setContext(addAuthHeader(access_token, headers));

              forward(operation).subscribe(observer);
            } catch (error) {
              observer.error(error);
              clearTokens();
            }
          })();
        });
      }
    }
  }
});

// Note: In the docummentation https://www.npmjs.com/package/subscriptions-transport-ws, subscriptions-transport-ws is marked depricated
// They recommend to use  `graphql-ws` instead

let wsClient: SubscriptionClient | undefined;

export function createWSLink() {
  wsClient = new SubscriptionClient(WS_LINK, {
    connectionParams: async () => {
      const accessToken = JSON.parse(localStorage.getItem('access_token') || '');

      return {
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      };
    },
    reconnect: true
  });
  wsClient.onConnected(() => console.log('WebSocket connected'));
  wsClient.onConnecting(() => console.log('WebSocket connecting...'));
  wsClient.onDisconnected(() => console.log('WebSocket disconnected'));
  wsClient.onError(error => console.error('WebSocket error', error));

  return new WebSocketLink(wsClient);
}

const forceReconnectWS = () => {
  if (wsClient) {
    wsClient.close(false, true);
  }
};
