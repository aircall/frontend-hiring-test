import { useState } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import Loader from '../../components/Layout/Loader';
import { darkTheme } from '../../style/theme/darkTheme';
import CallsListFilters from './components/CallsListFilters';
import useCallList from './hooks/useCallList';
import { PAGINATED_CALLS } from '../../gql/queries';
import { formatDate, formatDuration } from '../../helpers/dates';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

export const CallsListPage = () => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const [callsPerPage, setCallsPerPage] = useState<number>(5);
  const [filters, setFilters] = useState<CallListFilter | null>(null);

  const { getCallsGivenFilterCriteria, mapCallDataByCreationDate } = useCallList();

  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * callsPerPage,
      limit: callsPerPage
    }
    // onCompleted: () => handleRefreshToken(),
  });

  if (loading) return <Loader message="Loading calls..." />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const filteredCalls = getCallsGivenFilterCriteria(calls, filters!, filters?.dateSort);
  const callsToBeRendered = mapCallDataByCreationDate(filteredCalls);

  const applyFilters = (filtersToApply: CallListFilter): void => {
    setFilters(filtersToApply);
    setSearch(prevSearch => ({ ...Object.fromEntries(prevSearch), ...filtersToApply }));
  };

  const resetFilters = (): void => {
    setFilters(null);
    setSearch(prevSearch => {
      filters && Object.keys(filters).forEach(key => search.delete(key));
      return prevSearch;
    });
  };

  const handleOnPageSizeChange = (newPageSize: number): void => {
    setCallsPerPage(newPageSize);
  };

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    let queryParams = '';

    if (filters) {
      const searchParams = Object.assign(search);
      searchParams.delete('page');
      queryParams = `&${searchParams.toString()}`;
    }

    navigate({
      pathname: '/calls/',
      search: `?page=${page}${queryParams}`
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer space={3} direction="vertical">
        <CallsListFilters onApplyFilters={applyFilters} onResetFilters={resetFilters} />
      </Spacer>
      <Typography variant="caption">Calls</Typography>
      <Spacer space={3} direction="vertical">
        {Object.entries(callsToBeRendered!).map(([date, callsByDate], index) => {
          const formattedDate = formatDate(date, 'LLL d');
          return (
            <Box key={`group-calls-${date}-${index}`}>
              <Typography px={4} textAlign="right" color={darkTheme.colors['primary-500']}>
                {formattedDate}
              </Typography>
              {callsByDate.map((call: Call) => {
                const icon =
                  call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
                const title =
                  call.call_type === 'missed'
                    ? 'Missed call'
                    : call.call_type === 'answered'
                    ? 'Call answered'
                    : 'Voicemail';
                const subtitle =
                  call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
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
            </Box>
          );
        })}
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
            onPageSizeChange={handleOnPageSizeChange}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
