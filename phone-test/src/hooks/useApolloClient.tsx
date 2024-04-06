import { useEffect, useState, useCallback } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const useApolloClient = () => {
  const [apolloClient, setApolloClient] = useState<ApolloClient<any>>();

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

  const generateApolloClient = useCallback((tokenKey: string) => {
    const httpLink = createHttpLink({
      uri: 'https://frontend-test-api.aircall.dev/graphql'
    });

    const client = new ApolloClient({
      link: generateAuthLink(tokenKey).concat(httpLink),
      cache: new InMemoryCache()
    });

    return client;
  }, []);

  useEffect(() => {
    setApolloClient(generateApolloClient('access_token'));
  }, [generateApolloClient]);

  return {
    apolloClient,
    generateApolloClient
  };
};

export default useApolloClient;
