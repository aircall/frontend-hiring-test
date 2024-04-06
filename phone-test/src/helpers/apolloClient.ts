import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const generateAuthLink = (tokenKey: string) => {
    return setContext((_, { headers }) => {
      const token = localStorage.getItem(tokenKey);
      const parsedToken = token ? JSON.parse(token) : undefined;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${parsedToken}` : ''
        }
      };
    });
  };

const generateApolloClient = (tokenKey: string) => {
    const httpLink = createHttpLink({
      uri: 'https://frontend-test-api.aircall.dev/graphql'
    });

    const client = new ApolloClient({
      link: generateAuthLink(tokenKey).concat(httpLink),
      cache: new InMemoryCache()
    });

    return client;
  };

  export default generateApolloClient;