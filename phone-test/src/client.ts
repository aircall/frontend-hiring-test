import {
  ApolloLink,
  Observable,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  FetchResult
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { REFRESH_TOKEN } from './gql/mutations/refreshToken';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('access_token');
  let token = accessToken || undefined;

  if (operation.operationName === 'refreshTokenV2') {
    const refreshToken = localStorage.getItem('refresh_token');
    token = refreshToken || undefined;
  }

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${JSON.parse(token)}` : ''
    }
  });

  return forward(operation);
});

const refreshToken = async () => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN
    });
    const accessToken = data?.refreshTokenV2.access_token;
    if (!accessToken) {
      throw new GraphQLError('Empty AccessToken');
    }

    localStorage.setItem('access_token', JSON.stringify(accessToken));
    return accessToken;
  } catch (err) {
    localStorage.clear();
    throw err;
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.message) {
        case 'Unauthorized':
          // ignore 401 error for a refresh request
          if (operation.operationName === 'refreshTokenV2') return;

          const observable = new Observable<FetchResult<Record<string, any>>>(observer => {
            // used an annonymous function for using an async function
            (async () => {
              try {
                const accessToken = await refreshToken();

                operation.setContext({
                  headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${accessToken}`
                  }
                });

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

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
