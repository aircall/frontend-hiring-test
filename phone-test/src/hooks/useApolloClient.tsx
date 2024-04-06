import { useEffect, useState } from 'react';
import { ApolloClient } from '@apollo/client';
import generateApolloClient from '../helpers/apolloClient';

const useApolloClient = () => {
  const [apolloClient, setApolloClient] = useState<ApolloClient<any>>();

  useEffect(() => {
    setApolloClient(generateApolloClient('access_token'));
  }, []);

  return {
    apolloClient,
    setApolloClient
  };
};

export default useApolloClient;
