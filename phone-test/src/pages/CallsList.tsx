// @ts-nocheck
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Pagination
} from '@aircall/tractor';
import { Form, FormItem, Select } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getValidDate } from '../helpers/dates';

import { typeFilterOptions, directionFilterOptions, pageSizeOptions } from './options';

import { groupCallsByDate } from './options';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilteredCalls, setTotalFilteredCalls] = useState(0);

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
    if (data) {
      const { totalCount, nodes: calls } = data.paginatedCalls;
      const filteredCalls = filterCalls(calls, callTypeFilter, directionFilter);
      setTotalFilteredCalls(filteredCalls.length);
    }
  }, [data, callTypeFilter, directionFilter]);

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  console.log({totalFilteredCalls})

  console.log({ callTypeFilter });

  const filteredCalls = filterCalls(calls, callTypeFilter, directionFilter);

  const sortedAndFilteredCallsList = filteredCalls.sort((a: Call, b: Call) => {
    const dateA = getValidDate(a.created_at).getTime();
    const dateB = getValidDate(b.created_at).getTime();
    return dateB - dateA;
  });

  function groupCallsIntoPages(calls, pageSize) {
    const pages = [];
    for (let i = 0; i < calls.length; i += pageSize) {
      const page = calls.slice(i, i + pageSize);
      const groupedPage = groupCallsByDate(page);
      pages.push(groupedPage);
    }
    return pages;
  }





  const paginatedCalls = groupCallsIntoPages(sortedAndFilteredCallsList, selectedCallPerPage);

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
      </Form>
      <div style={{ height: '65vh', overflow: 'auto' }}>
        <Spacer space={3} direction="vertical" fluid>
          {
            <div>
              {Object.entries(currPage).map(([date, calls]) => (
                <div key={date}>
                  <h2>Date: {date}</h2>
                  {
                    calls.map(call => {
                      const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
                      const title = call.call_type === 'missed' ? 'Missed call' : call.call_type === 'answered' ? 'Call answered' : 'Voicemail';
                      const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
                      const duration = formatDuration(call.duration / 1000);
                      const date = formatDate(call.created_at);
                      const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;
          
                      return (
                        <Box
                          minWidth="1"
                          key={call.id}
                          bg="black-a30"
                          borderRadius={16}
                          cursor="pointer"
                          onClick={() => handleCallOnClick(call.id)}
                        >
                          <Grid
                            gridTemplateColumns="32px 1fr max-content"
                            columnGap={2}
                            borderBottom="1px solid"
                            borderBottomColor="neutral-700"
                            alignItems="center"
                            px={4}
                            py={2}
                          >
                            <Box><Icon component={icon} size={32} /></Box>
                            <Box>
                              <Typography variant="body">{title}</Typography>
                              <Typography variant="body2">{subtitle}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" textAlign="right">{duration}</Typography>
                              <Typography variant="caption">{date}</Typography>
                            </Box>
                          </Grid>
                          <Box px={4} py={2}><Typography variant="caption">{notes}</Typography></Box>
                        </Box>
                      );
                    })
                  }
                </div>
              ))}
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
              setSelectedCallPerPage(callsPerPage)
              setCurrentPage(1)
            }}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

function filterCalls(calls: Call[], callType?: string, direction?: string): Call[] {
  if (!calls) return [];
  // debugger;
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

function paginate(array: any[], pageSize: number, pageNumber: number): any[] {
  // debugger;
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

function groupCallsByDay(calls: Call[]): any[] {
  const groupedCalls = calls.reduce((acc: any, call: Call) => {
    const date = call.created_at.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(call);
    return acc;
  }, {});
  return Object.keys(groupedCalls).map(date => ({ date, calls: groupedCalls[date] }));
}

// function paginate(groupedCalls: { [key: string]: Call[] }, pageSize: number, pageNumber: number): { date: string, calls: Call[] }[] {
//   const paginatedGroupedCalls = {};
//   Object.entries(groupedCalls).forEach(([date, calls]) => {
//     paginatedGroupedCalls[date] = paginateArray(calls, pageSize, pageNumber);
//   });
//   return Object.entries(paginatedGroupedCalls).map(([date, calls]) => ({ date, calls }));
// }

function paginateArray(array: any[], pageSize: number, pageNumber: number): any[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

/** */

// function groupCallsByDay(calls: Call[], pageSize: number, pageNumber: number): any[] {
//   const groupedCallsByPage: any[] = [];

//   const groupedCallsByDay = calls.reduce((acc: any, call: Call) => {
//     const date = call.created_at.split('T')[0];
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(call);
//     return acc;
//   }, {});

//   const paginatedGroupedCallsByDay = paginateGroupedCallsByDay(groupedCallsByDay, pageSize, pageNumber);

//   paginatedGroupedCallsByDay.forEach((pageGroup) => {
//     const { date, calls } = pageGroup;
//     const paginatedCalls = paginateArray(calls, pageSize);
//     paginatedCalls.forEach((pageCalls) => {
//       groupedCallsByPage.push({ date, calls: pageCalls });
//     });
//   });

//   return groupedCallsByPage;
// }

// function paginateGroupedCallsByDay(groupedCallsByDay: any, pageSize: number, pageNumber: number): any[] {
//   const paginatedGroupedCallsByDay = Object.entries(groupedCallsByDay).map(([date, calls]) => {
//     const paginatedCalls = paginateArray(calls, pageSize * (pageNumber - 1), pageSize);
//     return { date, calls: paginatedCalls };
//   });
//   return paginatedGroupedCallsByDay;
// }

// function paginateArray(array: any[], start: number, end?: number): any[] {
//   return array.slice(start, end);
// }
