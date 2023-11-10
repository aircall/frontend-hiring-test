import styled from '@xstyled/styled-components';
import {
  Icon,
  Typography,
  Spacer,
  Box,
  Pagination,
  Banner,
  SpinnerOutlined,
  Flex
} from '@aircall/tractor';
import { useNavigate } from 'react-router-dom';
import { usePaginatedCallsQuery } from './usePaginatedCallsQuery';
import { useHandlePagination } from './useHandlePagination';
import { FILTERS_ACTIVE_PAGE, FILTERS_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './constants';
import { CallFilters } from './CallFilters';
import { useHandleCallFilters } from './CallFilters/useHandleCallFilters';
import { groupCallsByCreationDate } from './groupCallsByCreationDate';
import { CallItem } from './CallItem';
import { formatDate } from '../../helpers/dates';
import { sortCallsDescendingByCreationDate } from './sortCallsByCreationDate';
import { PATHS } from '../../constants/paths';
import { useHandleArchiveCallMutation } from './useHandleArchiveCallMutation';
import { useOnUpdateCallSubscription } from './useOnUpdateCallSubscription';

export const PaginationWrapper = styled.div`
  position: sticky;
  inset-block-end: 0px;
  padding-block-end: 16px;
  background-color: background-01;
  z-index: 3;

  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

export const CallsListPage = () => {
  const navigate = useNavigate();

  useOnUpdateCallSubscription();

  const { filters, setFilters, hasActiveFilters, filterCalls } = useHandleCallFilters();

  const { activePage, pageSize, onPageSizeChange, handlePageChange } = useHandlePagination();

  const { loading, error, data } = usePaginatedCallsQuery(
    hasActiveFilters ? FILTERS_ACTIVE_PAGE : activePage,
    hasActiveFilters ? FILTERS_PAGE_SIZE : pageSize
  );

  const { archiveCallHandler } = useHandleArchiveCallMutation();

  if (error)
    return (
      <Banner.Root variant="error" mt={40}>
        <Banner.Icon />
        <Box>
          <Banner.Heading mb={1}>Something went wrong</Banner.Heading>
          <Banner.Paragraph>
            We have been unable to fetch the calls. Please try again later, or contact our support
            team through support.aircall.io
          </Banner.Paragraph>
        </Box>
      </Banner.Root>
    );

  const { totalCount, nodes: calls = [] } = data?.paginatedCalls ?? {};

  const openCallDetailHandler = (callId: string) => {
    navigate(PATHS.CALL_DETAIL(callId));
  };

  const parsedCalls = hasActiveFilters ? filterCalls(calls, filters) : calls;

  const sortedCalls = sortCallsDescendingByCreationDate(parsedCalls);

  const groupedCalls = groupCallsByCreationDate(sortedCalls);

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3} as="h1">
        Calls History
      </Typography>
      <Box mb={3}>
        <CallFilters filters={filters} onChangeFilters={setFilters} />
      </Box>
      <Spacer space={6} direction="vertical">
        {Object.entries(groupedCalls).map(([dayDate, calls]) => (
          <Box key={dayDate}>
            <Typography as="h2" variant="displayS">
              Calls from {formatDate(dayDate, 'LLL d')}
            </Typography>
            <Spacer space={3} direction="vertical" fluid>
              {calls.map(call => (
                <CallItem
                  key={call.id}
                  call={call}
                  onOpenDetail={openCallDetailHandler}
                  onArchive={archiveCallHandler}
                />
              ))}
            </Spacer>
          </Box>
        ))}
      </Spacer>

      {!loading && calls.length === 0 && (
        <Banner.Root variant="neutral" mt={40}>
          <Banner.Icon />
          <Box>
            <Banner.Heading mb={1}>There's no calls in this page!</Banner.Heading>
            <Banner.Paragraph>
              If you are using pagination or filters, try resetting them.
            </Banner.Paragraph>
          </Box>
        </Banner.Root>
      )}

      {loading && (
        <Flex justifyContent="center" m={6}>
          <Icon component={SpinnerOutlined} spin />
        </Flex>
      )}

      {totalCount && !hasActiveFilters && (
        <PaginationWrapper data-test="pagination">
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
