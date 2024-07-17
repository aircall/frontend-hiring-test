import { gql } from '@apollo/client';

export const ARCHIVE_CALL = gql`
  mutation archiveCall($id: ID!) {
    archiveCall(id: $id) {
      id
      is_archived
    }
  }
`;
