import { ApolloLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { httpLink } from './httpLink';

/**
 * With splitLink, we make sure that wsLink is used for
 * subscriptions, and httpLink for queries and mutations
 *
 * The split function takes three parameters:
 *
 * - A function that's called for each operation to execute
 * - The Link to use for an operation if the function returns a "truthy" value
 * - The Link to use for an operation if the function returns a "falsy" value
 *
 * More info here: https://www.apollographql.com/docs/react/data/subscriptions/
 */
export const splitLink = (wsLink: ApolloLink) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
