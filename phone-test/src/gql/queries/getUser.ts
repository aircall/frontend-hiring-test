import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const GET_USER = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`;
