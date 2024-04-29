import { ApolloClient, createHttpLink, from, fromPromise, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
// import tokenStorage from '../../helpers/tokenStorage';
import { REFRESH_TOKEN } from '../mutations';


type TokenStorage = {
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    setAccessToken: (accessToken: string | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
  };
  
  const tokenStorage: TokenStorage = {
    getAccessToken: () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return null;
      return JSON.parse(accessToken);
    },
    getRefreshToken: () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return null;
      return JSON.parse(refreshToken);
    },
    setAccessToken: (accessToken: string | null) => {
      localStorage.setItem('access_token', JSON.stringify(accessToken));
    },
    setRefreshToken: (refreshToken: string | null) => {
      localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
    }
  };
  
  export default tokenStorage;
  

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

let isRefreshingToken: boolean = false;

const getRefreshedToken = async (): Promise<void> => {
  // Set refresh token as the current access token to be used in the request from authLink
  const refreshToken = tokenStorage.getRefreshToken();
  if (refreshToken) {
    tokenStorage.setAccessToken(refreshToken);
  }

  /**
   * If we are already refreshing the token, return the current promise
   * to avoid sending multiple requests
   */
  if (isRefreshingToken) return;

  isRefreshingToken = true;

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: refreshToken
      }
    });

    isRefreshingToken = false;

    const { access_token, refresh_token } = data.refreshTokenV2;

    // Update the tokens in local storage
    tokenStorage.setAccessToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);
  } catch (e) {
    throw new Error('Error refreshing token');
  }
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      const exception = err.extensions.exception as { status: number };
      /**
       * If the error is a 401, we need to refresh the token
       * and retry the request
       */
      if (exception && exception.status === 401) {
        return fromPromise(
          getRefreshedToken().catch(() => {
            // If we get an error while refreshing the token, log the user out
            localStorage.clear();
            window.location.href = '/login';
          })
        ).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

const authLink = setContext((_, { headers }) => {
  const accessToken = tokenStorage.getAccessToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  };
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});
