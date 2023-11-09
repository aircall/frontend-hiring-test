import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { tokenExpiredLink } from './links/tokenExpiredLink';
import { httpLink } from './links/httpLink';
import { authLink } from './links/authLink';

export const client = new ApolloClient({
  /**
   * The links are executed in order, and tokenExpiredLink must come first
   */
  link: from([tokenExpiredLink, authLink, httpLink]),
  cache: new InMemoryCache()
});
