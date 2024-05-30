import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Spacer, Pagination } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Call } from '../components/Call';
import { Filter } from '../components/Filter';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 25;

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' },
  { label: 'Missed', value: 'missed' },
  { label: 'Answered', value: 'answered' },
  { label: 'Voicemail', value: 'voicemail' }
];

interface GroupedCallsProps {
  [date: string]: Call[];
}

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const pageQueryParams = search.get('page');
  const perPageQueryParams = search.get('perPage');
  const filterQueryParams = search.get('filter');

  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const perPage = !!perPageQueryParams ? parseInt(perPageQueryParams) : CALLS_PER_PAGE;
  const filterValue = filterQueryParams || '';

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * perPage,
      limit: perPage
    }
    // onCompleted: () => handleRefreshToken(),
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const filteredCalls = calls.filter((call: Call) => {
    if (filterValue === '') return true;
    if (filterValue === 'inbound' || filterValue === 'outbound') {
      return call.direction === filterValue;
    }
    return call.call_type === filterValue;
  });

  const groupedCalls: GroupedCallsProps = filteredCalls.reduce(
    (acc: GroupedCallsProps, call: Call) => {
      const date = new Date(call.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(call);
      return acc;
    },
    {}
  );

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    navigate(`/calls/?perPage=${newPageSize}`);
  };

  const handleChangeFilter = (filterValue: string) => {
    if (filterValue === '') return navigate(`/calls/`);
    navigate(`/calls/?filter=${filterValue}`);
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Filter options={filterOptions} filter={filterValue} onChangeFilter={handleChangeFilter} />

      <Spacer space={3} direction="vertical">
        {Object.entries(groupedCalls).map(([date, calls]) => (
          <div key={date}>
            <Typography variant="displayS">{date}</Typography>
            {calls.map((call: Call) => (
              <Call key={call.id} call={call} onClick={handleCallOnClick} />
            ))}
          </div>
        ))}
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={perPage}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
            onPageSizeChange={handlePageSizeChange}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
