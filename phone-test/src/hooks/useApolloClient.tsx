import { useEffect, useState } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import generateApolloClient from '../services/apollo/apolloClient';
import { AUTH_CONFIG } from '../services/auth/authConfig';

const useApolloClient = (tokenKey?: string) => {
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    setApolloClient(generateApolloClient(tokenKey || AUTH_CONFIG.AUTH_TOKEN_KEY));
  }, [tokenKey]);

  return {
    apolloClient,
    setApolloClient
  };
};

export default useApolloClient;
