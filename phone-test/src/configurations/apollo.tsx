import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
