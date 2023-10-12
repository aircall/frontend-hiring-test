import { ApolloClient, InMemoryCache, createHttpLink, from, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
 console.log(graphQLErrors, networkError)
});

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql',
});

const wsLink = new WebSocketLink({
  uri: `wss://frontend-test-api.aircall.dev/websocket`,
  options: {
    reconnect: true,
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    authorization: accessToken ? `Bearer ${parsedToken}` : '',
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
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

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(splitLink)]),
  cache: new InMemoryCache(),
});

export default client;
