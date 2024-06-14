import { gql } from '@apollo/client';

export const CALL_FIELDS = gql`
  fragment CallFields on Call {
    id
    direction
    from
    to
    duration
    is_archived
    call_type
    via
    created_at
    notes {
      id
      content
    }
  }
`;
