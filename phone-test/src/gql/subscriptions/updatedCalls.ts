import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const UPDATED_CALLS = gql`
  ${CALL_FIELDS}
  subscription OnUpdatedCall{
    onUpdatedCall {
      ...CallFields
    }
  }
`;

