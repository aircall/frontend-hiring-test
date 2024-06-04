import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [search, setSearch] = useSearchParams();

  const activePage = useMemo(() => {
    const pageQueryParam = search.get('page');
    return pageQueryParam ? parseInt(pageQueryParam) : 1;
  }, [search]);

  const activeLimit = useMemo(() => {
    const limitQueryParam = search.get('limit');
    return limitQueryParam ? parseInt(limitQueryParam) : defaultItemsCount;
  }, [search, defaultItemsCount]);

  const handlePageChange = (page: number) => {
    setSearch({ page: page.toString(), limit: activeLimit.toString() });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearch({ page: '1', limit: pageSize.toString() });
  };

  return {
    handlePageChange,
    handlePageSizeChange,
    activePage,
    callsPerPage: activeLimit
  };
};
