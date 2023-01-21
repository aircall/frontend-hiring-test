import { gql } from '@apollo/client';

export const CALL_SUBSCRIPTION = gql`
  subscription onUpdatedCall {
    onUpdatedCall {
      id
      is_archived
      notes {
        id
        content
      }
    }
  }
`;
