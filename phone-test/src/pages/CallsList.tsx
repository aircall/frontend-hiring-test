import { useMutation, useQuery, useSubscription } from '@apollo/client';
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
  Pagination,
  Button
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARCHIVE_CALL } from '../gql/mutations';
import { ON_UPDATED_CALL } from '../gql/subscription/updateCall';

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
  const sizeQueryParams = search.get('size');
  const callsPerPage = !!sizeQueryParams ? parseInt(sizeQueryParams) : CALLS_PER_PAGE;

  useSubscription(ON_UPDATED_CALL);
  const [archiveMutation] = useMutation(ARCHIVE_CALL);
  const { loading, error, data, subscribeToMore } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * callsPerPage,
      limit: callsPerPage
    }
  });

  subscribeToMore({
    document: ON_UPDATED_CALL
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number, size: number = callsPerPage) => {
    let url = `/calls/?page=${page ? page : 1}`;
    if (size !== CALLS_PER_PAGE) url += `&size=${size}`;

    navigate(url);
  };

  /**
   * Get the total sum of calls before the current page.
   */
  const handlePageSizeChange = (newPageSize: number) => {
    /**
     * The intention is to resize the lists but keeping track of the current position
     * so the user doesn't lose track of those calls he has already viewed.
     *
     * That's why we add 1 to the total list to make sure we
     * take into count the position of the very first call in the current list.
     */
    const prevCallsToCurrentList = (activePage - 1) * callsPerPage;
    const newPage = (prevCallsToCurrentList + 1) / newPageSize;
    handlePageChange(Math.ceil(newPage), newPageSize);
  };

  /**
   * Archive/Unarchive calls
   * @param e: HTMLButtonElement
   * @param callId: string ex: 12345-6789
   */
  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, callId: string) => {
    e.stopPropagation();

    archiveMutation({
      variables: { id: callId }
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
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
              key={call.id}
              id={call.id}
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
              <Box px={4} py={2} display="flex" style={{ justifyContent: 'space-between' }}>
                <Typography variant="caption">{notes}</Typography>
                <Button mode="link" onClick={e => handleArchive(e, call.id)}>
                  <Typography variant="caption">
                    {call.is_archived ? 'unarchive' : 'archive'}
                  </Typography>
                </Button>
              </Box>
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
            onPageSizeChange={handlePageSizeChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
