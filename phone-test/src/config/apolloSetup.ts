import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  Observable,
  FetchResult,
  ApolloLink
} from '@apollo/client';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const graphqlUrl = 'https://frontend-test-api.aircall.dev/graphql';

const httpLink = createHttpLink({
  uri: graphqlUrl
});

const authLink = setContext((_, { headers }) => {
  // // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: parsedToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.message) {
        case 'Unauthorized':
          // ignore 401 error for a refresh request
          if (operation.operationName === 'RefreshTokenV2') return;
          const observable = new Observable<FetchResult<Record<string, any>>>(observer => {
            // used an annonymous function for using an async function
            (async () => {
              try {
                const accessToken = await refreshToken();

                if (!accessToken) {
                  throw new GraphQLError('Empty AccessToken');
                }

                // Retry the failed request
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                };

                forward(operation).subscribe(subscriber);
              } catch (err) {
                observer.error(err);
              }
            })();
          });

          return observable;
      }
    }
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

// Request a refresh token to then stores and returns the accessToken.
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token');
    }

    const query = {
        operationName: 'RefreshTokenV2',
        query: `mutation RefreshTokenV2 {
          refreshTokenV2 {
            access_token
            refresh_token
          }
        }`,
        variables: {}
      };

    const refreshTokenMutation = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${JSON.parse(refresh)}`
      },
      body: JSON.stringify(query)
    });
    const response = await refreshTokenMutation.json();

    if (response.errors) {
      throw new Error('Error refreshing token');
    }

    const accessToken = response.data?.refreshTokenV2.access_token;
    localStorage.setItem('access_token', JSON.stringify(accessToken));

    const refreshToken = response.data?.refreshTokenV2.refresh_token;
    localStorage.setItem('refresh_token', JSON.stringify(refreshToken));

    return accessToken;
  } catch (err) {
    throw err;
  }
};
