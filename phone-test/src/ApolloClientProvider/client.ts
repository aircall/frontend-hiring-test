import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { tokenExpiredLink } from './links/tokenExpiredLink';
import { authLink } from './links/authLink';
import { createWSLink } from './links/wsLink';
import { splitLink } from './links/splitLink';

function link() {
  const wsLink = createWSLink();

  return from([tokenExpiredLink, authLink, splitLink(wsLink)]);
}

export const client = new ApolloClient({
  /**
   * The links are executed in order, and tokenExpiredLink must come first
   */
  link: link(),
  cache: new InMemoryCache()
});

/**
 * Function to be used when authorization tokens change,
 * mostly needed for wsLink to renew its access_token
 */
export function resetApolloClientLinksOnAuthorizationTokensChange() {
  client.setLink(link());
}

/**
 * Function to be used when authorization tokens change
 */
export function clearApolloClientCacheOnLogout() {
  client.clearStore();
}
