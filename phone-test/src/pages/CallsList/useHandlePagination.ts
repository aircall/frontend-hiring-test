import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 5;

export function useHandlePagination() {
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const [search] = useSearchParams();
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const onPageSizeChange = (callsPerPage: number) => {
    setPageSize(callsPerPage);
  };

  return {
    activePage,
    pageSize,
    onPageSizeChange,
    handlePageChange
  };
}
