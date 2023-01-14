import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import errorLink from './errorLink';
import authLink from './authlink';
import wsLink from './wsConnection';

const httpLink = createHttpLink({ uri: `${process.env.REACT_APP_API_URL}` });

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(splitLink),
  cache: new InMemoryCache()
});

export default apolloClient;
