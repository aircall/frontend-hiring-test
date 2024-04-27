// @ts-nocheck
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Grid, Icon, Typography, Spacer, Box, DiagonalDownOutlined, DiagonalUpOutlined, Pagination } from '@aircall/tractor';
import { Form, FormItem, Select } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getValidDate } from '../helpers/dates';

export const typeFilterOptions = [
  // { label: 'All', value: '' },
  { label: 'Answered', value: 'answered' },
  { label: 'Missed', value: 'missed' },
  { label: 'Voicemail', value: 'voicemail' }
];

export const directionFilterOptions = [
  { label: 'All', value: '' },
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' }
];

const pageSizeOptions = [
  { value: 5, label: '5' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
];

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

  const [selectedCallPerPage, setSelectedCallPerPage] = useState(CALLS_PER_PAGE);
  const [callTypeFilter, setCallTypeFilter] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: 0,
      limit: 200
    }
  });

  useEffect(() => {
    setCurrentPage(activePage);
  }, [activePage]);

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  console.log({callTypeFilter})

  const filteredCalls = filterCalls(calls, callTypeFilter, directionFilter);

  const sortedAndFilteredCallsList = filteredCalls.sort((a: Call, b: Call) => {
    const dateA = getValidDate(a.created_at).getTime();
    const dateB = getValidDate(b.created_at).getTime();
    return dateB - dateA;
  });

  const paginatedCalls = paginate(sortedAndFilteredCallsList, selectedCallPerPage, currentPage);

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/calls/?page=${page}`);
  };

  // const handleFilterChange = (type: string, value: string) => {
  //   if (type === 'type') setCallTypeFilter(value);
  //   else if (type === 'direction') setDirectionFilter(value);
  // };

  console.log({selectedCallPerPage, paginatedCalls, sortedAndFilteredCallsList})
  console.log({directionFilter})

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>Calls History</Typography>
      <Form>
        <Spacer fluid={true} space={3} direction="horizontal" justifyContent="stretch" itemsSized="evenly-sized">
          <FormItem label="Call Type">
            <Select
              takeTriggerWidth={true}
              placeholder="All"
              selectionMode="multiple"
              size="regular"
              options={typeFilterOptions}
              onSelectionChange={(currentSelectedKeys) => setCallTypeFilter(currentSelectedKeys)}
            />
          </FormItem>
          <FormItem label="Call Direction">
            <Select
              takeTriggerWidth={true}
              placeholder="All"
              size="regular"
              options={directionFilterOptions}
              onSelectionChange={(currentSelectedKeys) => setDirectionFilter(currentSelectedKeys[0])}
            />
          </FormItem>
        </Spacer>
      </Form>
      <div style={{ height: '65vh', overflow: 'auto' }}>
        <Spacer space={3} direction="vertical" fluid>
          {paginatedCalls.map((call: Call) => {
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
          })}
        </Spacer>
      </div>
      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={currentPage}
            pageSize={selectedCallPerPage}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
            onPageSizeChange={(callsPerPage) => setSelectedCallPerPage(callsPerPage)}
          />
        </PaginationWrapper>
      )}
    </>
  );
};

function filterCalls(calls: Call[], callType?: string, direction?: string): Call[] {
  if (!calls) return [];
  // debugger;
  return calls.filter(call => (
    
    (!callType || callType.length === 0 || callType.includes(call.call_type)) &&
    (!direction || direction === '' || call.direction === direction)
  ));
}

function paginate(array: any[], pageSize: number, pageNumber: number): any[] {
  // debugger;
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}
