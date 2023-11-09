import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export interface LOGIN_VARIABLES {
  input: LoginInput;
}
export interface LOGIN_DATA {
  login: AuthResponseType;
}

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
