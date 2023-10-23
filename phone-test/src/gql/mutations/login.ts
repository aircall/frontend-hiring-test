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

export const REFRESH_TOKEN = gql`
  ${USER_FIELDS}

  mutation RefreshTokenV2 {
    refreshTokenV2 {
      access_token
      refresh_token
      user {
        ...UserFields
      }
    }
  }
`;