import { createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});
