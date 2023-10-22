import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import {
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Flex,
  Grid,
  Icon,
  Pagination,
  Spacer,
  Typography
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Filters } from '../components/filters/Filters';

export const PaginationWrapper = styled.div`
  > div {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    width: inherit;
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
  const callTypeOptions = [
    { label: 'Answered', value: 'answered' },
    { label: 'Missed', value: 'missed' },
    { label: 'Voicemail', value: 'voicemail' }
  ];
  const [selectedCallType, setSelectedCallType] = useState<Call['call_type'] | 'all'>('all');
  const callDirectionOptions = [
    { label: 'Inbound', value: 'inbound' },
    { label: 'Outbound', value: 'outbound' }
  ];
  const [selectedCallDirection, setSelectedCallDirection] = useState<Call['direction'] | 'all'>(
    'all'
  );
  const [calls, setCalls] = useState<Array<Call>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { loading, error, data } = useQuery<{
    paginatedCalls: {
      totalCount: number;
      nodes: Call[];
    };
  }>(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * selectedPageSize,
      limit: selectedPageSize
    },
    onCompleted: data => {
      setCalls(data.paginatedCalls.nodes);
      setTotalCount(data.paginatedCalls.totalCount);
    }
  });

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

  const handleCallTypeChange = (callType: Call['call_type'] | 'all') => {
    setSelectedCallType(callType);
  };

  const handleCallDirectionChange = (direction: Call['direction'] | 'all') => {
    setSelectedCallDirection(direction);
  };

  useEffect(() => {
    if (!data) return;

    const unfilteredCalls = data.paginatedCalls.nodes;
    const filteredCalls = unfilteredCalls.filter(({ call_type, direction }) => {
      const hasSelectedCallType = call_type === selectedCallType || selectedCallType === 'all';
      const hasSelectedCallDirection =
        direction === selectedCallDirection || selectedCallDirection === 'all';
      return hasSelectedCallType && hasSelectedCallDirection;
    });

    setCalls(filteredCalls);
  }, [data, selectedCallType, selectedCallDirection]);

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" w="100%">
        <Typography variant="displayM" textAlign="center" py={3}>
          Calls History
        </Typography>
        <Filters
          filterGroups={[
            {
              title: 'CALL TYPE',
              onChange: handleCallTypeChange as any,
              options: callTypeOptions,
              selected: selectedCallType
            },
            {
              title: 'DIRECTION',
              onChange: handleCallDirectionChange as any,
              options: callDirectionOptions,
              selected: selectedCallDirection
            }
          ]}
        />
      </Flex>
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
