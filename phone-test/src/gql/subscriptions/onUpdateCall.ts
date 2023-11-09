import { gql } from '@apollo/client';

export const ON_UPDATE_CALL = gql`
  subscription OnUpdateCall {
    onUpdatedCall {
      id
      is_archived
    }
  }
`;
