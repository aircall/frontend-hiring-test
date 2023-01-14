import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from './token';

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getAccessToken()
  }
}));

export default authLink;
