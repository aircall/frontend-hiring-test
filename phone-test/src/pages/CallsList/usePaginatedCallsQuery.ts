import { useQuery } from '@apollo/client';
import { PAGINATED_CALLS } from '../../gql/queries';

export function usePaginatedCallsQuery(activePage: number, pageSize: number) {
  return useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * pageSize,
      limit: pageSize
    }
  });
}
