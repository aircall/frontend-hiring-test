import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Pagination } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CallLister from '../components/CallLister/CallLister';
import { getValidDate } from '../helpers/dates';

export const CallsListPage = () => {
  // Hooks
  const [search, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Constants
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const callsPerPageQueryParams = search.get('perPage');
  const callsPerPage = !!callsPerPageQueryParams ? parseInt(callsPerPageQueryParams) : 5;
  const directionFilter = search.get('direction') ?? '';
  const typeFiltersArray = search.get('type')?.split(',') || [];
  const isListFiltered = !!directionFilter || !!typeFiltersArray.length;

  console.log(typeFiltersArray);

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: isListFiltered ? 0 : (activePage - 1) * callsPerPage,
      limit: isListFiltered ? 200 : callsPerPage
    }
    // onCompleted: () => handleRefreshToken(),
  });

  // Status check
  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;
  const filteredCallsList = isListFiltered
    ? calls.filter((call: any) => {
        if (!!directionFilter && call.direction !== directionFilter) return false;
        return typeFiltersArray.includes(call.call_type);
      })
    : calls;
  const sortedAndFilteredCallsList = [...filteredCallsList].sort((a: Call, b: Call) => {
    const dateA = getValidDate(a.created_at).getTime();
    console.log('dateA: ', dateA);

    const dateB = getValidDate(b.created_at);
    return dateA - dateB.getTime();
  });

  console.log('filteredCallsList: ', filteredCallsList);

  // Constants
  const pageSizeOptions = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 25,
      label: '25'
    },
    {
      value: 50,
      label: '50'
    },
    {
      value: 100,
      label: '100'
    }
  ];

  // Handler Functions
  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newTotalPages = Math.ceil(totalCount / newPageSize);
    const newActivePage = newTotalPages < activePage ? Math.floor(newTotalPages) : activePage;
    setSearchParams((prev: URLSearchParams) => {
      prev.set('perPage', newPageSize.toString());
      prev.set('page', newActivePage.toString());
      return prev;
    });
  };

  const handleFilterChange = (filterCategory: string, newFilterValue: string) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set(filterCategory, newFilterValue);
      return prev;
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <CallLister
        calls={
          isListFiltered
            ? sortedAndFilteredCallsList.slice(
                (activePage - 1) * callsPerPage,
                activePage * callsPerPage
              )
            : sortedAndFilteredCallsList
        }
        onCallClick={handleCallOnClick}
      />
      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            recordsTotalCount={isListFiltered ? sortedAndFilteredCallsList.length : totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;
