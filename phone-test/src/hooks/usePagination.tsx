import { useMemo } from 'react';
import { useQueryParams } from './useQueryParams';

interface UsePaginationProps {
  defaultItemsCount: number;
}
interface UsePaginationResult {
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  activePage: number;
  callsPerPage: number;
}

export const usePagination = ({ defaultItemsCount }: UsePaginationProps): UsePaginationResult => {
  const { getQueryParam, setQueryParam, setQueryParams } = useQueryParams();

  const activePage = useMemo(() => {
    const pageQueryParam = getQueryParam('page');
    return pageQueryParam ? parseInt(pageQueryParam) : 1;
  }, [getQueryParam]);

  const callsPerPage = useMemo(() => {
    const limitQueryParam = getQueryParam('limit');
    return limitQueryParam ? parseInt(limitQueryParam) : defaultItemsCount;
  }, [getQueryParam, defaultItemsCount]);
  
  const handlePageChange = (page: number) => {
    setQueryParam('page', page.toString());
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQueryParams({ page: '1', limit: pageSize.toString() });
  };

  return {
    handlePageChange,
    handlePageSizeChange,
    activePage,
    callsPerPage
  };
};
