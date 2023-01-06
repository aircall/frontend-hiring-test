import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const ADD_NOTE = gql`
  ${CALL_FIELDS}
  mutation AddNote($input: AddNoteInput!) {
    addNote(input: $input) {
      ...CallFields
    }
  }
`;
