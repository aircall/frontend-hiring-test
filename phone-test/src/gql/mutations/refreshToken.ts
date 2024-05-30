import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const REFRESH_TOKEN = gql`
  ${USER_FIELDS}
  mutation refreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
      user {
        ...UserFields
      }
    }
  }
`;
