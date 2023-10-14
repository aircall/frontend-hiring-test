import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const LOGIN = gql`
  ${USER_FIELDS}

  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      refresh_token
      user {
        ...UserFields
      }
    }
  }
`;

export const GET_ACCESS_TOKEN = gql`
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
