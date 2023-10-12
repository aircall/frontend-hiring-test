import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

export const REFRESH = 'REFRESH';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'wss://frontend-test-api.aircall.dev/websocket',
  options: {
    reconnect: true,
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const parsedAccessToken = accessToken ? JSON.parse(accessToken) : undefined;
  const parsedRefreshToken = refreshToken ? JSON.parse(refreshToken) : undefined;

  // handling refresh token scenario
  if (headers?.refresh) {
    return {
      headers: {
        ...headers,
        authorization: headers.refresh === REFRESH ? `Bearer ${parsedRefreshToken}` : ''
      }
    }
  }

  // return the headers to the context so httpLink can read them
  return {
    authorization: accessToken ? `Bearer ${parsedAccessToken}` : '',
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedAccessToken}` : ''
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});
