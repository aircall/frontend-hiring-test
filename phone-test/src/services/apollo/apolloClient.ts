import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { APOLLO_CONFIG } from './apolloConfig'

const getTokenGivenKey = (tokenKey: string): string => {
  const token = localStorage.getItem(tokenKey);
  const parsedToken = token ? JSON.parse(token) : undefined;
  return token ? `Bearer ${parsedToken}` : '';
}

const httpLink = createHttpLink({
  uri: APOLLO_CONFIG.GQL_HTTP_URI
});

const wsLink = (tokenKey: string): WebSocketLink => {
  const token = getTokenGivenKey(tokenKey);
  return new WebSocketLink({
    uri: APOLLO_CONFIG.GQL_WS_URI,
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

const generateApolloClient = (tokenKey: string): ApolloClient<NormalizedCacheObject> => {
    
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
