import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';

import { authLink, createWSLink, errorLink, httpLink } from './links';
import { getMainDefinition } from '@apollo/client/utilities';

const splitLink = (wsLink: ApolloLink) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );

export function initializeApolloClient(): ApolloClient<any> {
  const wsLink = createWSLink();
  const splitLinkInstance = splitLink(wsLink);

  const link = ApolloLink.from([errorLink, authLink, splitLinkInstance]);

  return new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
}

const client = initializeApolloClient();
export default client;
