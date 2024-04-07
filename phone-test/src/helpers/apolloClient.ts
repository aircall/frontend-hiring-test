import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';

const getTokenGivenKey = (tokenKey: string): string => {
  const token = localStorage.getItem(tokenKey);
  const parsedToken = token ? JSON.parse(token) : undefined;
  return token ? `Bearer ${parsedToken}` : '';
}

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const wsLink = (tokenKey: string): WebSocketLink => {
  const token = getTokenGivenKey(tokenKey);
  return new WebSocketLink({
    uri: 'wss://frontend-test-api.aircall.dev/websocket',
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: {
        Authorization: token,
        authToken: token
      }
    }
  });
};

const generateApolloClient = (tokenKey: string) => {
    
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: getTokenGivenKey(tokenKey),
      }
    };
  });
  
  const splitLink = split(
    ({ query }) => {
    const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      );
    },
    wsLink(tokenKey),
    authLink.concat(httpLink),
  );
  
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  });

  return client;
};

export default generateApolloClient;
