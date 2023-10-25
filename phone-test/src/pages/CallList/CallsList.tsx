import { Flex, Pagination, Spacer, Typography } from '@aircall/tractor';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { CallGroup } from '../../components/callGroup/CallGroup';
import { Filters } from '../../components/filters/Filters';
import { PAGINATED_CALLS } from '../../gql/queries';
import { formatDate } from '../../helpers/dates/dates';

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
  const [groupedCalls, setGroupedCalls] = useState<{ [date: string]: Array<Call> }>();
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
      setTotalCount(data.paginatedCalls.totalCount);
    }
  });

  const groupCallsByDate = (calls: Array<Call>) => {
    return calls.reduce((groupedCalls: { [date: string]: Array<Call> }, call) => {
      const date = formatDate(call.created_at, { withoutTime: true });
      const isDateAlreadyGrouped = Object.keys(groupedCalls).includes(date);

      return isDateAlreadyGrouped
        ? {
            ...groupedCalls,
            [date]: [...groupedCalls[date], call]
          }
        : {
            ...groupedCalls,
            [date]: [call]
          };
    }, {});
  };

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
    const groupedCalls = groupCallsByDate(filteredCalls);
    setGroupedCalls(groupedCalls);
  }, [data, selectedCallType, selectedCallDirection]);

  if (loading) return <Typography variant="displayM">Loading calls...</Typography>;
  if (error) return <Typography variant="displayM">ERROR</Typography>;
  if (!data) return <Typography variant="displayM">Not found</Typography>;
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" w="100%">
        <Typography variant="displayM" textAlign="center" py={4}>
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
      <Spacer space={4} direction="vertical">
        {groupedCalls &&
          Object.keys(groupedCalls).map((date: string) => (
            <CallGroup
              calls={groupedCalls[date]}
              date={date}
              key={date}
              onCall={handleCallOnClick}
            />
          ))}
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
