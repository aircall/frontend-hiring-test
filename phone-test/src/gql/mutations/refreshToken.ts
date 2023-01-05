import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const REFRESH_TOKEN = gql`
${USER_FIELDS}

mutation {
  refreshTokenV2 {
    access_token
    user {
      ...UserFields
    }
  }
}
`;
