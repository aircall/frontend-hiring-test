import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  createHttpLink,
  NormalizedCacheObject
} from '@apollo/client';

import { getAccessToken } from '../apollo/shared/token';
import Config from '../config';
import { setContext } from '@apollo/client/link/context';
import { Token } from '../helpers/constants';

const createApolloClient = (token: string | null) => {
  const httpLink = createHttpLink({ uri: `https://${Config.BASE_URL}/graphql` });

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? token : ''
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
};

const ApolloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    createApolloClient(getAccessToken())
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === Token.ACCESS) {
        setClient(createApolloClient(getAccessToken()));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};

export default ApolloProvider;
