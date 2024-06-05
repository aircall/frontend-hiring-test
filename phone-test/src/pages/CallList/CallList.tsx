import { useNavigate } from 'react-router-dom';
import { Pagination } from '@aircall/tractor';
import { useGetPaginatedCalls } from '../../api';
import { useFilters, usePagination } from '../../hooks';
import { CALLS_FILTERS, DEFAULT_ITEMS_COUNT_PER_PAGE, pageSizeOptions } from './constatnts';
import { Header } from '../../components';
import { List } from './components/List';
import * as S from './styles';
import { PageWrapper } from '../../components';
import { Filters } from './components/Filters';
import { useMemo } from 'react';

export const CallsListPage = () => {
  const navigate = useNavigate();

  const { filters, onFilterChange, filter } = useFilters({
    defaultValues: CALLS_FILTERS
  });
  const { activePage, callsPerPage, handlePageChange, handlePageSizeChange } = usePagination({
    defaultItemsCount: DEFAULT_ITEMS_COUNT_PER_PAGE
  });
  const { loading, error, data } = useGetPaginatedCalls({ activePage, activeLimit: callsPerPage });

  const { totalCount, nodes: calls = [] } = data?.paginatedCalls || {};

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const filteredCalls = useMemo(() => filter(calls), [filter, calls]);

  return (
    <PageWrapper isLoading={loading} error={error} data={data}>
      <Header title="Calls History" />
      <Filters filters={filters} onFilterChange={onFilterChange} />
      <List calls={filteredCalls} onClick={handleCallOnClick} />
      {totalCount && (
        <S.PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            recordsTotalCount={totalCount}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </S.PaginationWrapper>
      )}
    </PageWrapper>
  );
};
