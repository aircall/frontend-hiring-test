import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { PAGINATED_CALLS } from '../gql/queries';
import { Flex } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CallsListHistory } from '../views/CallsList/CallsListHistory';
import { CallsListPagination } from '../views/CallsList/CallsListPagination';
import { CallsListHeader } from '../views/CallsList/CallsListHeader';
import { ProtectedLayout } from '../components/routing/ProtectedLayout';
import { useToken } from '../hooks/useToken';

const CALLS_PER_PAGE_OPTIONS = [5, 10, 20];

export interface Call {
  id: string;
  direction: 'inbound' | 'outbound';
  call_type: 'missed' | 'answered' | 'voicemail';
  duration: number;
  from: string;
  to: string;
  created_at: string;
  is_archived: boolean;
  notes?: { id: string; content: string }[];
}

export const CallsListPage: React.FC = () => {
  const [search] = useSearchParams();
  const { refreshToken } = useToken();
  const navigate = useNavigate();
  const pageQueryParams = search.get('page');
  const itemsPerPageQueryParams = search.get('itemsPerPage');
  const callTypeFilterQueryParams = search.get('callType');
  const directionFilterQueryParams = search.get('direction');

  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const itemsPerPage = !!itemsPerPageQueryParams
    ? parseInt(itemsPerPageQueryParams)
    : CALLS_PER_PAGE_OPTIONS[0];
  const [callTypeFilter, setCallTypeFilter] = useState(callTypeFilterQueryParams || '');
  const [directionFilter, setDirectionFilter] = useState(directionFilterQueryParams || '');

  const { loading, error, data, refetch } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * itemsPerPage,
      limit: itemsPerPage
    },
    onCompleted: refreshToken
  });

  useEffect(() => {
    refetch({
      offset: (activePage - 1) * itemsPerPage,
      limit: itemsPerPage
    });
  }, [itemsPerPage, activePage, refetch]);

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}&itemsPerPage=${itemsPerPage}`);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    navigate(`/calls/?page=1&itemsPerPage=${newItemsPerPage}`);
  };

  const handleCallTypeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCallTypeFilter(event.target.value);
  };

  const handleDirectionFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDirectionFilter(event.target.value);
  };

  const totalCount = data?.paginatedCalls?.totalCount ?? 0;
  const calls = data?.paginatedCalls.nodes ?? [];

  const handleCallOnClick = (callId: string) => navigate(`/calls/${callId}`);

  return (
    <ProtectedLayout>
      <Flex flexDirection={'column'} minH="100%" justifyContent={'space-between'} flex={1}>
        <Flex flexDirection="column" flex={1}>
          <CallsListHeader
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            options={CALLS_PER_PAGE_OPTIONS}
            callTypeFilter={callTypeFilter}
            directionFilter={directionFilter}
            onCallTypeFilterChange={handleCallTypeFilterChange}
            onDirectionFilterChange={handleDirectionFilterChange}
          />
          <CallsListHistory
            calls={calls}
            handleCallOnClick={handleCallOnClick}
            loading={loading}
            error={error}
            callTypeFilter={callTypeFilter}
            directionFilter={directionFilter}
          />
        </Flex>

        <CallsListPagination
          activePage={activePage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          recordsTotalCount={totalCount}
        />
      </Flex>
    </ProtectedLayout>
  );
};
