import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const ON_UPDATED_CALL = gql`
  ${CALL_FIELDS}

  subscription {
    onUpdatedCall {
      ...CallFields
    }
  }
`;
