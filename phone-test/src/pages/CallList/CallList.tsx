import { useNavigate } from 'react-router-dom';

import {
  Grid,
  Icon,
  Typography,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Pagination
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';

import { useGetPaginatedCalls } from '../../api';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_ITEMS_COUNT_PER_PAGE, pageSizeOptions } from './constatnts';
import * as S from './styles';

export const CallsListPage = () => {
  const navigate = useNavigate();

  const { activePage, activeLimit, callsPerPage, handlePageChange, handlePageSizeChange } =
    usePagination({
      defaultItemsCount: DEFAULT_ITEMS_COUNT_PER_PAGE
    });

  const { loading, error, data } = useGetPaginatedCalls({ activePage, activeLimit });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  return (
    //TODO: Refactor JSX , create seperate component
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>

      <S.CallsList space={3} direction="vertical">
        {calls.map((call: Call) => {
          // TODO: Refactor this part
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
      </S.CallsList>

      {totalCount && (
        <S.PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={callsPerPage}
            recordsTotalCount={totalCount}
            pageSizeOptions={pageSizeOptions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </S.PaginationWrapper>
      )}
    </>
  );
};
