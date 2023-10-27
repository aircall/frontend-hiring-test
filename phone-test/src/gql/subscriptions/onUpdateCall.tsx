import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments/call';

export const CALL_UPDATED = gql`
  ${CALL_FIELDS}

  subscription onUpdateCall {
    onUpdatedCall {
      ...CallFields
    }
  }
`;
