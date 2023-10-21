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
import { useState } from 'react';

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
  const pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '40', value: 40 }
  ];
  const [selectedPageSize, setSelectedPageSize] = useState<number>(pageSizeOptions[0].value);
  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * selectedPageSize,
      limit: selectedPageSize
    }
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handlePageSizeChange = (pageSizeValue: number) => {
    if (!pageSizeValue) return;
    setSelectedPageSize(pageSizeValue);
    handlePageChange(1);
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
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSize={selectedPageSize}
            pageSizeOptions={pageSizeOptions}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
