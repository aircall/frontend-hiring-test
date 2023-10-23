import { gql } from '@apollo/client';
import { USER_FIELDS } from '../fragments/user';

export const ME = gql`
  ${USER_FIELDS}
  query Me {
    me {
      ...UserFields
    }
  }
`;
