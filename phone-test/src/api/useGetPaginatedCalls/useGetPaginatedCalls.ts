import { useQuery } from '@apollo/client';
import { PAGINATED_CALLS } from '../../gql/queries';
import { PaginatedCallsDTO, PaginatedCallsParams } from './types';

export const useGetPaginatedCalls = ({ activePage, activeLimit }: PaginatedCallsParams) =>
  useQuery<PaginatedCallsDTO>(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * activeLimit,
      limit: activeLimit
    }
  });
