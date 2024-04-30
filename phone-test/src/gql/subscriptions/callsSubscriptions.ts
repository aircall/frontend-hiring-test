import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const CALLS_SUBSCRIPTION = gql`
  ${CALL_FIELDS}

  subscription onUpdateCal {
    onUpdatedCall {
      ...CallFields
    }
  }
`;
