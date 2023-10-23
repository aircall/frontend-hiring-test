import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const USER_ME = gql`
  ${USER_FIELDS}
  query UserMe {
    me {
      ...UserFields
    }
  }
`;
