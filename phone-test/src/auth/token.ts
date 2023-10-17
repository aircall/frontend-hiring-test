import { client } from '../App';
import { REFRESH_TOKEN } from '../gql/mutations';

let isRefresh = false;

const getToken = async () => {
  const refreshToken = getRefreshToken();
  if (isRefresh) {
    return Promise.reject('need logout');
  }

  window.localStorage.setItem('access_token', JSON.stringify(refreshToken));

  isRefresh = true;
  const {
    data: { refreshTokenV2 }
  } = await client.mutate({
    mutation: REFRESH_TOKEN,
    context: {
      headers: {
        authorization: getAccessToken()
      }
    }
  });
  isRefresh = false;

  const accessToken = refreshTokenV2.access_token;
  window.localStorage.setItem('access_token', JSON.stringify(accessToken));
};

const getRefreshToken = () => {
  const accessToken = window.localStorage.getItem('refresh_token');
  return accessToken ? JSON.parse(accessToken) : undefined;
};

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  return accessToken ? `Bearer ${parsedToken}` : '';
};

export const refreshToken = () =>
  getToken().catch(() => {
    window.localStorage.clear();
    window.location.reload();
  });
