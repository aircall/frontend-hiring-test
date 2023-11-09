import { FetchResult, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';
import { addOrRemoveLocalStorageItem } from '../../helpers/localStorage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constants/localStorageKeys';
import { client, resetApolloClientLinksOnAuthorizationTokensChange } from '../client';
import {
  REFRESH_TOKEN_DATA,
  REFRESH_TOKEN_V2,
  REFRESH_TOKEN_V2_OPERATION_NAME
} from '../../gql/mutations/refreshTokenV2';

export const tokenExpiredLink = onError(
  ({ graphQLErrors, operation, forward }): Observable<FetchResult> | void => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (isUnauthorizedError(error)) {
          // Skip token refresh for the specific REFRESH_TOKEN_V2_OPERATION_NAME operation
          if (operation.operationName === REFRESH_TOKEN_V2_OPERATION_NAME) {
            return;
          }

          // We need to use Observables to add async logic to Apollo Client's onError handler
          const observable = new Observable<FetchResult>(observer => {
            // Wrap the asynchronous logic in an IIFE (Immediately Invoked Function Expression)
            // to allow the use of async/await within a synchronous context.
            void (async () => {
              try {
                // Attempt to fetch a new access token
                const accessToken = await fetchAndStoreNewAccessAndRefreshTokens();

                resetApolloClientLinksOnAuthorizationTokensChange();

                // If fetching fails or there's no access token, throw an error
                if (!accessToken) {
                  throw new GraphQLError('Authentication error. User must log in manually.');
                }

                // Get the existing headers and add the new access token
                const headers = (operation.getContext().headers as { [key: string]: string }) ?? {};
                operation.setContext({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${accessToken}`
                  }
                });

                // Set up the subscriber to forward the operation and handle errors
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                };

                // Forward the operation and subscribe to the result
                forward(operation).subscribe(subscriber);
              } catch (error) {
                // Handle errors during the process
                observer.error(error);

                // Clear access and refresh tokens on error
                clearAccessAndRefreshTokens();
              }
            })();
          });

          return observable;
        }
      }
    }
  }
);

function isUnauthorizedError(error: GraphQLError) {
  return error.message === 'Unauthorized';
}

export const fetchAndStoreNewAccessAndRefreshTokens = async (): Promise<string | void> => {
  const { data } = await client.mutate<REFRESH_TOKEN_DATA>({
    mutation: REFRESH_TOKEN_V2
  });

  if (data?.refreshTokenV2) {
    const { access_token, refresh_token } = data?.refreshTokenV2;

    addOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY, access_token);
    addOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY, refresh_token);

    return access_token;
  }
};

export const clearAccessAndRefreshTokens = async (): Promise<string | void> => {
  addOrRemoveLocalStorageItem(ACCESS_TOKEN_KEY);
  addOrRemoveLocalStorageItem(REFRESH_TOKEN_KEY);
};
