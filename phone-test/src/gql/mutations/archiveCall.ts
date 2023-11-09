import { gql } from '@apollo/client';

export interface ARCHIVE_CALL_VARIABLES {
  id: Call['id'];
}

export interface ARCHIVE_CALL_DATA {
  archiveCall: Pick<Call, 'id' | 'is_archived'>;
}

export const ARCHIVE_CALL = gql`
  mutation ArchiveCall($id: ID!) {
    archiveCall(id: $id) {
      id
      is_archived
    }
  }
`;
