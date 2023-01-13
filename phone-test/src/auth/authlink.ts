import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const accessToken = window.localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

export default authLink;
