import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../../gql/queries';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Pagination,
  Dropdown,
  DropdownButton,
  PreferencesOutlined,
  Menu,
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CallDirection, CallType, Constants, PAGE_SIZES } from '../../constants/constants';
import { useEffect, useState } from 'react';
import './Call.css';
import { MenuItem } from '../../components/MenuItem';
import { groupByDate } from '../../helpers/calls.group';

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
  const callsPerPage = parseInt(search.get('size') ?? Constants.defaultPaginationSize.toString());
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const [directionFilter, setDirectionFilter] = useState<CallDirection>();
  const [calls, setCalls] = useState<any>();


  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * callsPerPage,
      limit: callsPerPage
    },
    onCompleted: (data) => handleCalls((data.paginatedCalls as PaginatedCalls).nodes),
  });


  const { totalCount } = data ? data.paginatedCalls : 0;

  const handleCalls = (list: Call[]) => {

    let sortList = [...list].sort(function (a, b) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if (directionFilter) {
      sortList = sortList.filter(call => call.direction === directionFilter);

    }

    const finalList = groupByDate(sortList, 'created_at');

    setCalls(finalList);

  }

  useEffect(() => {
    if (loading === false && data) {
      handleCalls((data.paginatedCalls as PaginatedCalls).nodes);
    }
  }, [directionFilter])


  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}?page=${activePage}&size=${callsPerPage}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}&size=${callsPerPage}`);
  };

  const handleSizeChange = (size: number) => {
    navigate(`/calls/?page=${activePage}&size=${size}`);
  };


  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer space="s" marginLeft="10">
        <Dropdown trigger={<DropdownButton mode="link" variant="primary" iconClose={<PreferencesOutlined />}>
          Filters
        </DropdownButton>} >
          <Menu>
            <MenuItem setDirectionFilter={setDirectionFilter} label={'ALL'} selected={directionFilter == undefined} value={undefined}></MenuItem>
            <MenuItem setDirectionFilter={setDirectionFilter} label={'INBOUND'} selected={directionFilter == CallDirection.INBOUND} value={CallDirection.INBOUND}></MenuItem>
            <MenuItem setDirectionFilter={setDirectionFilter} label={'OUTBOUND'} selected={directionFilter == CallDirection.OUTBOUND} value={CallDirection.OUTBOUND}></MenuItem>
          </Menu>
        </Dropdown>
      </Spacer>
      <Box maxHeight="70vh" overflow="scroll" p={4}>
        <Spacer minWidth="100%" space={3} direction="vertical">
          {calls && Object.keys(calls).map((date: string) => {
            return (<div key={date}>
              <div className='call-date-section'>{date}</div>
              {calls[date] && calls[date].map((call: Call) => {
                const icon = call.direction === CallDirection.INBOUND ? DiagonalDownOutlined : DiagonalUpOutlined;
                const title =
                  call.call_type === CallType.MISSED
                    ? 'Missed call'
                    : call.call_type === CallType.ANSWERED
                      ? 'Call answered'
                      : 'Voicemail';
                const subtitle = call.direction === CallDirection.INBOUND ? `from ${call.from}` : `to ${call.to}`;
                const duration = formatDuration(call.duration / 1000);
                const date = formatDate(call.created_at);
                const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

                return (
                  <Box
                    key={call.id}
                    bg="black-a30"
                    borderRadius={16}
                    cursor="pointer"
                    onClick={() => handleCallOnClick(call.id)}
                    className="call-date-card"
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
            </div>)
          })}


        </Spacer>
      </Box>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleSizeChange}
            recordsTotalCount={totalCount}
            pageSizeOptions={PAGE_SIZES}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
