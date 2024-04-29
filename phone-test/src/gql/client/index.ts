import { ApolloClient, createHttpLink, from, fromPromise, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from '../mutations';

const GRAPHQL_ENDPOINT = 'https://frontend-test-api.aircall.dev/graphql';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT
});

let isRefreshingToken: boolean = false;

const getRefreshedToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken || isRefreshingToken) return;

  isRefreshingToken = true;

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: JSON.parse(refreshToken)
      }
    });

    const { access_token, refresh_token } = data.refreshTokenV2;

    localStorage.setItem('access_token', JSON.stringify(access_token));
    localStorage.setItem('refresh_token', JSON.stringify(refresh_token));

  } catch (e) {
    throw new Error('Error refreshing token');
  } finally {
    isRefreshingToken = false;
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
  const currentAccessToken = localStorage.getItem('access_token');
  const accessToken = currentAccessToken ? JSON.parse(currentAccessToken) : null;

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
