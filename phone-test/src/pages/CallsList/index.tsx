import styled from '@xstyled/styled-components';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  Pagination,
  DiagonalDownOutlined,
  DiagonalUpOutlined
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { useNavigate } from 'react-router-dom';
import { usePaginatedCallsQuery } from './usePaginatedCallsQuery';
import { useHandlePagination } from './useHandlePagination';
import { PAGE_SIZE_OPTIONS } from './constants';

export const PaginationWrapper = styled.div`
  position: sticky;
  inset-block-end: 0px;
  padding-block-end: 16px;
  background-color: background-01;

  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

export const CallsListPage = () => {
  const navigate = useNavigate();

  const { activePage, pageSize, onPageSizeChange, handlePageChange } = useHandlePagination();

  const { loading, error, data } = usePaginatedCallsQuery(activePage, pageSize);

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
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
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={onPageSizeChange}
            recordsTotalCount={totalCount}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
