import { useNavigate } from 'react-router-dom';

import { Pagination } from '@aircall/tractor';

import { useGetPaginatedCalls } from '../../api';
import { usePagination } from '../../hooks';
import { DEFAULT_ITEMS_COUNT_PER_PAGE, pageSizeOptions } from './constatnts';
import { Header } from '../../components';
import { List } from './components/List';

import * as S from './styles';
import { PageWrapper } from '../../components';

export const CallsListPage = () => {
  const navigate = useNavigate();

  const { activePage, callsPerPage, handlePageChange, handlePageSizeChange } = usePagination({
    defaultItemsCount: DEFAULT_ITEMS_COUNT_PER_PAGE
  });

  const { loading, error, data } = useGetPaginatedCalls({ activePage, activeLimit: callsPerPage });

  const totalCount = data?.paginatedCalls.totalCount;
  const calls = data?.paginatedCalls.nodes || [];

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  return (
    <PageWrapper isLoading={loading} error={error} data={data}>
      <Header title="Calls History" />
      <List calls={calls} onCLick={handleCallOnClick} />
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
