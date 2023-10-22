import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import {
  Typography,
  Spacer,
  Box,
  Pagination
} from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CallListItem from '../components/calls/CallListItem/CallListItem';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 25;

export const CallsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageQueryParams = searchParams.get('page');
  const callsPerPage = parseInt(searchParams.get('cpe') || CALLS_PER_PAGE.toString());
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * CALLS_PER_PAGE,
      limit: CALLS_PER_PAGE
    }
    // onCompleted: () => handleRefreshToken(),
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data?.paginatedCalls;

  const handlePageChange = (page: number) => {
    console.log(page, Math.ceil(totalCount / callsPerPage), totalCount, callsPerPage);
    if (page === activePage) return;
    if (page < 1) page= 1;
    if (page > Math.ceil(totalCount / callsPerPage)) page= Math.ceil(totalCount / callsPerPage);
    setSearchParams(params => {
      params.set('page', page.toString());
      return params;
    });

    navigate(`/calls/?${searchParams.toString()}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearchParams(params => {
      params.set('page', '1');
      if (pageSize === CALLS_PER_PAGE || !pageSize) params.delete('cpe');
      else params.set('cpe', pageSize.toString());
      return params;
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Box overflow="auto" minWidth={500} paddingTop={5} maxHeight="80vh">
        <Spacer space={3} direction="vertical">
          {calls.map((call: Call) => (
            <CallListItem call={call} key={call.id} />
          ))}
        </Spacer>
      </Box>
      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            defaultPageSize={CALLS_PER_PAGE}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
