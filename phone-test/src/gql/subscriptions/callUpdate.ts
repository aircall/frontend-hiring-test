import { gql } from '@apollo/client';

export const CALL_UPDATE = gql`
  subscription OnUpdateCall {
    onUpdatedCall {
      id
      is_archived
    }
  }
`;
