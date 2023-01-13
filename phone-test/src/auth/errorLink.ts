import { fromPromise } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import client from '.';
import { REFRESH_TOKEN } from '../gql/mutations';

const getRefreshToken = () => {
  const accessToken = window.localStorage.getItem('refresh_token');
  return accessToken ? JSON.parse(accessToken) : undefined;
};

let isRefreshing = false;
/**
 * Refresh expired access token
 * @returns Promise with new access token
 */
const getNewToken = async () => {
  const refreshToken = getRefreshToken();
  if (isRefreshing) {
    return Promise.reject('Got in a loop refreshing. Needs to be logged out.');
  }

  /**
   * Use "refresh token" as "access token" momentarily so we can still make use
   * of authLink as it is (setting header context with "access token") when doing
   * the following mutation to refresh the expired token.
   * */
  window.localStorage.setItem('access_token', JSON.stringify(refreshToken));

  isRefreshing = true;
  const {
    data: { refreshTokenV2 }
  } = await client.mutate({
    mutation: REFRESH_TOKEN
  });
  isRefreshing = false;

  // Set new access token
  const accessToken = refreshTokenV2.access_token;
  window.localStorage.setItem('access_token', JSON.stringify(accessToken));
};

/**
 * Error handler for `Apollo`.
 * Will refresh access token if graphql fails to authorize (401)
 */
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { exception } = error.extensions as { exception: { status: number } };
      if (exception.status === 401) {
        return fromPromise(
          getNewToken().catch(() => {
            window.localStorage.clear();
            window.location.reload();
          })
        ).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

export default errorLink;
