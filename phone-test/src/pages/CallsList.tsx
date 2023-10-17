import { useQuery, useSubscription } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import {
  Typography,
  Spacer,
  Pagination,
  Button
} from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ON_UPDATED_CALL } from '../gql/subscription/updateCall';
import { useState } from 'react';
import CallListDisplay from '../components/callListDisplay/callListDisplay';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 5;

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const sizeQueryParams = search.get('size');
  const callsPerPage = !!sizeQueryParams ? parseInt(sizeQueryParams) : CALLS_PER_PAGE;

  useSubscription(ON_UPDATED_CALL);
  const [isArchiveActive, setIsArchiveActive] = useState<boolean>(false)
  const { loading, error, data, subscribeToMore } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * callsPerPage,
      limit: callsPerPage
    }
  });

  subscribeToMore({
    document: ON_UPDATED_CALL
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handlePageChange = (page: number, size: number = callsPerPage) => {
    let url = `/calls/?page=${page ? page : 1}`;
    if (size !== CALLS_PER_PAGE) url += `&size=${size}`;

    navigate(url);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const prevCallsToCurrentList = (activePage - 1) * callsPerPage;
    const newPage = (prevCallsToCurrentList + 1) / newPageSize;
    handlePageChange(Math.ceil(newPage), newPageSize);
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer mb={10}>
        <Button size='small' variant={isArchiveActive ? 'instructive':'standard'} 
          onClick={() => setIsArchiveActive(isArchiveActive => !isArchiveActive)}
        >
          Archived{` (${calls.filter((call: Call) => call.is_archived).length})`}
        </Button>
      </Spacer>
        <CallListDisplay calls={calls} archivedButtonActive={isArchiveActive} />
      

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
