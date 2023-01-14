import { fromPromise } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { refreshToken } from './token';

/**
 * Error handler for `Apollo`.
 * Will refresh access token if graphql fails to authorize (401)
 */
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { exception } = error.extensions as { exception: { status: number } };
      if (exception.status === 401) {
        return fromPromise(refreshToken()).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

export default errorLink;
