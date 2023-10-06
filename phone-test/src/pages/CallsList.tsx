import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Spacer, Pagination, Select } from '@aircall/tractor';
import { truncDate } from '../helpers/dates';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { groupBy } from '../helpers/collections';
import { List } from '../components/common/List';
import { CallListItem } from './CallListItem';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

type PageSizeType = Required<
  React.ComponentPropsWithRef<typeof Pagination>
>['pageSizeOptions'][number];

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100, 150, 200].map(
  value =>
    ({
      label: value.toString(),
      value
    } as PageSizeType)
);

type CallTypeFilter = Call['call_type'];
const CALL_TYPE_FILTERS: CallTypeFilter[] = ['answered', 'voicemail', 'missed'];

type CallDirectionFilter = Call['direction'];
const CALL_DIRECTION_TYPE_FILTERS: CallDirectionFilter[] = ['inbound', 'outbound'];

export const CallsListPage = () => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();

  const pageQueryParams = search.get('page');
  const pageSizeQueryParams = search.get('page_size');
  const callTypeQueryParams = search.get('call_type');
  const callDirectionQueryParams = search.get('call_direction');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const pageSize = !!pageSizeQueryParams
    ? parseInt(pageSizeQueryParams)
    : PAGE_SIZE_OPTIONS[0].value;
  const callTypeFilter = (callTypeQueryParams?.split(',') as CallTypeFilter[]) ?? CALL_TYPE_FILTERS;
  const callDirectionFilter =
    (callDirectionQueryParams?.split(',') as CallDirectionFilter[]) ?? CALL_DIRECTION_TYPE_FILTERS;

  const { loading, error, data } = useQuery<{
    paginatedCalls: { totalCount: number; nodes: Call[] };
  }>(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * pageSize,
      limit: pageSize
    }
    // onCompleted: () => handleRefreshToken(),
  });

  const handleOnChangeCallTypeFilter = (selectedFilters: CallTypeFilter[]) => {
    setSearch(prev => ({
      ...Object.fromEntries(prev.entries()),
      call_type: selectedFilters.join(',')
    }));
  };

  const handleOnChangeCallDirectionFilter = (selectedFilters: CallDirectionFilter[]) => {
    setSearch(prev => ({
      ...Object.fromEntries(prev.entries()),
      call_direction: selectedFilters.join(',')
    }));
  };

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    setSearch(prev => ({
      ...Object.fromEntries(prev.entries()),
      page: page.toString()
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearch(prev => ({
      ...Object.fromEntries(prev.entries()),
      page_size: pageSize.toString(),
      page: '1'
    }));
  };

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const groupedCalls = Object.entries(
    groupBy(
      calls.filter(
        call =>
          callTypeFilter.includes(call.call_type) && callDirectionFilter.includes(call.direction)
      ),
      call => truncDate(call.created_at)
    )
  );

  groupedCalls.sort((valueL, valueR) => valueL[0].localeCompare(valueR[0]));

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Spacer space={3} direction="vertical">
        <Select
          size="small"
          placeholder="Filter by call type"
          selectionMode="multiple"
          selectedKeys={callTypeFilter}
          onSelectionChange={handleOnChangeCallTypeFilter}
          options={CALL_TYPE_FILTERS.map(value => ({
            value,
            label: value.toUpperCase()
          }))}
        />
        <Select
          size="small"
          placeholder="Filter by call direction"
          selectionMode="multiple"
          selectedKeys={callDirectionFilter}
          onSelectionChange={handleOnChangeCallDirectionFilter}
          options={CALL_DIRECTION_TYPE_FILTERS.map(value => ({
            value,
            label: value.toUpperCase()
          }))}
        />
        <List>
          {groupedCalls.map(([date, calls]) => (
            <CallListItem key={date} calls={calls} header={date} onCallClick={handleCallOnClick} />
          ))}
        </List>
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
