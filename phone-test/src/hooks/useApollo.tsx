import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderBase,
  createHttpLink,
  split,
  NormalizedCacheObject
} from '@apollo/client';

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
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

  const wsLink = new WebSocketLink(
    new SubscriptionClient(`wss://${Config.BASE_URL}/websocket`, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => ({
        authorization: token ? token : ''
      })
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: authLink.concat(splitLink),
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
        console.log('new token detected');

        setClient(createApolloClient(getAccessToken()));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    console.log('client updated');
  }, [client]);

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
};

export default ApolloProvider;
