// @ts-nocheck
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Spacer, Pagination } from '@aircall/tractor';
import { Form, FormItem, Select, Button } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getValidDate } from '../helpers/dates';

import { typeFilterOptions, directionFilterOptions, pageSizeOptions } from './options';
import { CallDetail } from './CallDetail';
import { groupCallsIntoPages } from './options';

import { CALLS_PER_PAGE } from './options';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;
export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const [selectedCallPerPage, setSelectedCallPerPage] = useState(CALLS_PER_PAGE);
  const [callTypeFilter, setCallTypeFilter] = useState(['all']);
  const [directionFilter, setDirectionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalFilteredCalls, setTotalFilteredCalls] = useState(0);
  const [paginatedCalls, setPaginatedCalls] = useState([]);
  
  const [sortDirection, setSortDirection] = useState('descending');

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: 0,
      limit: 200
    }
  });

  useEffect(() => {
    setCurrentPage(activePage);
  }, [activePage]);

  useEffect(() => {
    console.log('passes here')
    if (data) {
      const { totalCount, nodes: calls } = data.paginatedCalls;
      const filteredCalls = filterCalls(calls, callTypeFilter, directionFilter);
      setTotalFilteredCalls(filteredCalls.length);
  
      // Recalculate paginatedCalls using sortedAndFilteredCallsList and selectedCallPerPage
      const newPaginatedCalls = groupCallsIntoPages(
        sortedAndFilteredCallsList(filteredCalls, sortDirection),
        selectedCallPerPage
      );
      setPaginatedCalls(newPaginatedCalls);
    }
  }, [data, callTypeFilter, directionFilter, selectedCallPerPage, sortDirection]);

    //   useEffect(() => {
    //   // Recalculate paginatedCalls using sortedAndFilteredCallsList and selectedCallPerPage
    //   const newPaginatedCalls = groupCallsIntoPages(
    //     sortedAndFilteredCallsList(filteredCalls, sortDirection),
    //     selectedCallPerPage
    //   );
    //   setPaginatedCalls(newPaginatedCalls);
    // }, [filteredCalls, selectedCallPerPage, sortDirection]);

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const filteredCalls = filterCalls(calls, callTypeFilter, directionFilter);

  const sortedAndFilteredCallsList = (filteredCalls: Call[], sortOrder: string) =>
    filteredCalls.sort((a: Call, b: Call) => {
      const dateA = getValidDate(a.created_at).getTime();
      const dateB = getValidDate(b.created_at).getTime();
      // Sort in ascending order if sortOrder is 'ascending'
      if (sortOrder === 'ascending') {
        return dateA - dateB;
      }
      // Default to descending order for any other value or if sortOrder is not provided
      return dateB - dateA;
    });


console.log({paginatedCalls})

  const currPage = paginatedCalls[currentPage];

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/calls/?page=${page}`);
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Form>
        <Spacer
          fluid={true}
          space={3}
          direction="horizontal"
          justifyContent="stretch"
          itemsSized="evenly-sized"
        >
          <FormItem label="Call Type">
            <Select
              takeTriggerWidth={true}
              placeholder="All"
              selectionMode="multiple"
              defaultValue={['all']}
              size="regular"
              options={typeFilterOptions}
              onSelectionChange={currentSelectedKeys => setCallTypeFilter(currentSelectedKeys)}
            />
          </FormItem>
          <FormItem label="Call Direction">
            <Select
              takeTriggerWidth={true}
              placeholder="All"
              size="regular"
              options={directionFilterOptions}
              onSelectionChange={currentSelectedKeys => setDirectionFilter(currentSelectedKeys[0])}
            />
          </FormItem>
        </Spacer>
        <Button mode="link" size="small" onClick={() => setSortDirection('descending')}>
          {`Sort Desc`}
        </Button>
        <Button mode="link" size="small" onClick={() => setSortDirection('ascending')}>
          {`Sort Asc`}
        </Button>
      </Form>
      <div style={{ height: '60vh', overflow: 'auto' }}>
        <Spacer space={3} direction="vertical" fluid>
          {
            <div>
              {currPage ? (
                Object.entries(currPage).map(([date, calls]) => (
                  <div key={date}>
                    <h2>Date: {date}</h2>
                    {calls.map((call) => (
                      <CallDetail key={call.id} call={call} onClick={handleCallOnClick} />
                    ))}
                  </div>
                ))
              ) : (
                // make this pretty
                <div>No Content</div>
              )}
            </div>
          }
        </Spacer>
      </div>
      {totalFilteredCalls > 0 && (
        // {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={currentPage}
            pageSize={selectedCallPerPage}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            // recordsTotalCount={totalCount}
            recordsTotalCount={totalFilteredCalls}
            onPageSizeChange={callsPerPage => {
              setSelectedCallPerPage(callsPerPage);
              setCurrentPage(0);
            }}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

function filterCalls(calls: Call[], callType?: string, direction?: string): Call[] {
  if (!calls) return [];
  return calls.filter(
    call =>
      (!callType ||
        callType.length === 0 ||
        (callType.length === 1 && callType[0] === 'all') ||
        callType.includes(call.call_type)) &&
      // (!callType || callType === 0 || callType.includes(call.call_type)) &&
      (!direction || direction === '' || call.direction === direction)
  );
}

