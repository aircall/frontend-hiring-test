import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const ARCHIVE_CALL = gql`
  ${CALL_FIELDS}

  mutation archiveCall($id: ID!) {
    archiveCall(id: $id) {
      ...CallFields
    }
  }
`;
