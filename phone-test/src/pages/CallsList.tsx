// @ts-nocheck
import {useState, useEffect} from 'react';

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
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

  // const [selectedCallPerPage, setSelectedCallPerPage] = useState(CALLS_PER_PAGE);

  const [selectedCallPerPage, setSelectedCallPerPage] = useState(CALLS_PER_PAGE);
  const [callTypeFilter, setCallTypeFilter] = useState('');
  const [directionFilter, setDirectionFilter] = useState('inbound');

  // need to update schema on server SIDE_OPTIONS. This not being possible need to filter the 
  // calls locally.

  const { loading, error, data, refetch } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * selectedCallPerPage,
      limit: selectedCallPerPage,
      callType: callTypeFilter,
      direction: directionFilter
    }
  });

  const [callTypes, setCallTypes] = useState([]);

  useEffect(() => {

  },[])

  // useEffect(() => {
  //   refetch({
  //     offset: (activePage - 1) * selectedCallPerPage,
  //     limit: selectedCallPerPage,
  //     callType: callTypeFilter,
  //     direction: directionFilter
  //   });
  // }, [activePage, selectedCallPerPage, refetch, callTypeFilter, directionFilter]);

  // const { loading, error, data } = useQuery(PAGINATED_CALLS, {
  //   variables: {
  //     offset: (activePage - 1) * CALLS_PER_PAGE,
  //     limit: CALLS_PER_PAGE
  //   }
  //   // onCompleted: () => handleRefreshToken(),
  // });

  
  

  const filterCallTypes = (calls: Call[]) => {
    return calls.filter(call => {
      // return !direction || call.direction === direction
      return call.call_type;
    });
  };

  const filterCalls = (calls: Call[], callType?: string, direction?: string) => {
    if (!calls) return [];
    debugger;
    return calls.filter(call => {
      // return !direction || call.direction === direction
      return (!callType || call.call_type === callType) &&
             (!direction || call.direction === direction);
    });
  };



  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  // const uniqueCallTypes: string[] = Array.from(new Set(calls.map(call => call.call_type)));
  

  // const filteredCalls = filterCalls(data.paginatedCalls.nodes, 'voicemail',);
  // const filteredCalls = filterCalls(data.paginatedCalls.nodes, 'voicemail', 'inbound');

  // console.log({filteredCalls})

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  // figure out how to force card width to conform to wrapper
  // really hate the jump we get while we're loading data
  // beware of key props

  // ToDo: implement filter & hide pagination display if there's no need for it

  // const filteredCallTypes = filterCallTypes(data.paginatedCalls.nodes);

  // console.log({uniqueCallTypes})

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <div style={{ 
        // background: 'red', 
        height: '70vh', overflow: 'auto' }}>
        <Spacer space={3} direction="vertical">
          {calls.map((call: Call) => {
            const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
            const title =
              call.call_type === 'missed'
                ? 'Missed call'
                : call.call_type === 'answered'
                ? 'Call answered'
                : 'Voicemail';
            const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
            const duration = formatDuration(call.duration / 1000);
            const date = formatDate(call.created_at);
            const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

            return (
              <Box
                //  width="1"
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
                  // background={'blue'}
                >
                  <Box>
                    <Icon component={icon} size={32} />
                  </Box>
                  <Box>
                    <Typography variant="body">{title}</Typography>
                    <Typography variant="body2">{subtitle}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" textAlign="right">
                      {duration}
                    </Typography>
                    <Typography variant="caption">{date}</Typography>
                  </Box>
                </Grid>
                <Box px={4} py={2}>
                  <Typography variant="caption">{notes}</Typography>
                </Box>
              </Box>
            );
          })}
        </Spacer>
      </div>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={selectedCallPerPage}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
            onPageSizeChange={(callsPerPage) => {
              console.log(`output from page size change: ${callsPerPage}`);
              setSelectedCallPerPage(callsPerPage)
            }
            }
          />
        </PaginationWrapper>
      )}
    </>
  );
};
