import apolloClient from '.';
import { REFRESH_TOKEN } from '../gql/mutations';

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
  } = await apolloClient.mutate({
    mutation: REFRESH_TOKEN,
    context: {
      headers: {
        authorization: getAccessToken()
      }
    }
  });
  isRefreshing = false;

  // Set new access token
  const accessToken = refreshTokenV2.access_token;
  window.localStorage.setItem('access_token', JSON.stringify(accessToken));
};

const getRefreshToken = () => {
  const accessToken = window.localStorage.getItem('refresh_token');
  return accessToken ? JSON.parse(accessToken) : undefined;
};

/**
 * Get current access_token from localStorage
 * @returns access_token: string ex: `Bearer abc.123.xyz`
 */
export const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  return accessToken ? `Bearer ${parsedToken}` : '';
};

/**
 * Refresh expired token
 */
export const refreshToken = () =>
  getNewToken().catch(() => {
    window.localStorage.clear();
    window.location.reload();
  });
