import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';

import { authLink, errorLink, httpLink } from './links';

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
