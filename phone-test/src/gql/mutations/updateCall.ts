import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const UPDATE_CALL = gql`
  ${CALL_FIELDS}
  mutation ArchiveCall($id: ID!) {
    archiveCall(id: $id) {
      ...CallFields
    }
  }
`;
