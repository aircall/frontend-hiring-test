import { gql } from '@apollo/client';
import { CALL_FIELDS } from '../fragments';

export const PAGINATED_CALLS = gql`
  ${CALL_FIELDS}
  query PaginatedCalls($offset: Float!, $limit: Float!) {
    paginatedCalls(offset: $offset, limit: $limit) {
      nodes {
        ...CallFields
      }
      totalCount
      hasNextPage
    }
  }
`;
