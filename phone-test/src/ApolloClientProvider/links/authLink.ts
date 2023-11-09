import { setContext } from '@apollo/client/link/context';
import { getLocalStorageItem } from '../../helpers/localStorage';
import { REFRESH_TOKEN_V2_OPERATION_NAME } from '../../gql/mutations/refreshTokenV2';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constants/localStorageKeys';

export const authLink = setContext((operation, { headers }) => {
  // Get the access token from local storage if it exists
  let authorizationToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

  // We need to use the refresh token for the refresh token operation
  if (operation.operationName === REFRESH_TOKEN_V2_OPERATION_NAME) {
    authorizationToken = getLocalStorageItem(REFRESH_TOKEN_KEY);
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: authorizationToken ? `Bearer ${authorizationToken}` : ''
    }
  };
});
