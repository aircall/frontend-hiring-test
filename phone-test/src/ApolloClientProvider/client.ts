import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { authLink, httpLink } from './links';

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache()
});
