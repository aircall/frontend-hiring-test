import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Pagination } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CallLister from '../components/CallLister/CallLister';
import { getValidDate } from '../helpers/dates';
import FilterBar from '../components/FilterBar/FilterBar';

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

  console.log(isListFiltered);

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: 0,
      limit: 200
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
        let doesPassDirectionFilter = true;
        let doesPassTypeFilter = true;
        if (!!directionFilter) {
          doesPassDirectionFilter = call.direction === directionFilter;
        }
        if (!!typeFiltersArray.length) {
          doesPassTypeFilter = typeFiltersArray.includes(call.call_type);
        }
        return doesPassDirectionFilter && doesPassTypeFilter;
      })
    : calls;
  const sortedAndFilteredCallsList = [...filteredCallsList].sort((a: Call, b: Call) => {
    const dateA = getValidDate(a.created_at).getTime();
    const dateB = getValidDate(b.created_at).getTime();
    return dateB - dateA;
  });

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
      if (!!newFilterValue) {
        prev.set(filterCategory, newFilterValue);
      } else {
        prev.delete(filterCategory);
      }
      return prev;
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <FilterBar handleFilterChange={handleFilterChange} />
      <CallLister
        calls={sortedAndFilteredCallsList.slice(
          (activePage - 1) * callsPerPage,
          activePage * callsPerPage
        )}
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
