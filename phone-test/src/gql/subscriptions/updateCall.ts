import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const UPDATE_CALL = gql`
  ${CALL_FIELDS}
  subscription OnUpdateCall {
    onUpdatedCall {
        ...CallFields
    }
  }
`;