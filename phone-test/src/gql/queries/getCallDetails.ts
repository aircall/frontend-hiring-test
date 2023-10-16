import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const GET_CALL_DETAILS = gql`
  ${CALL_FIELDS}
  query Call($id: ID!) {
    call(id: $id) {
      ...CallFields
    }
  }
`;

export const ARCHIVE_CALLS = gql`
  ${CALL_FIELDS}
  mutation ArchiveCall($id: ID!) {
    archiveCall(id: $id) {
      ...CallFields
    }
  }
`;
