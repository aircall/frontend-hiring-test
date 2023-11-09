import { createHttpLink } from '@apollo/client';

export const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});
