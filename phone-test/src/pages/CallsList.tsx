import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from 'gql/queries';
import {
  Typography,
  Spacer,
  Box,
  Pagination,
  Accordion,
  SpinnerOutlined,
  Flex,
  ArrowDownFilled
} from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CallListItem, CallsFilterBar, EmptyCallListItem } from '../components/calls';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 25;

export const CallsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageQueryParams = searchParams.get('page');
  const directionQueryParams = searchParams.get('dir') || '';
  const typeQueryParams = searchParams.get('type');
  const callsPerPage = parseInt(searchParams.get('cpe') || CALLS_PER_PAGE.toString());
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const activePage = parseInt(pageQueryParams || '1');
  const { loading, error, data } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: 0,
      limit: 1000
    }
  });

  const calls = data?.paginatedCalls.nodes;

  useEffect(() => {
    if (calls) {
      let filteredCalls = [...calls];

      if (directionQueryParams) {
        filteredCalls = calls.filter((call: Call) => call.direction === directionQueryParams);
      }
      if (typeQueryParams) {
        filteredCalls = calls.filter((call: Call) => call.call_type === typeQueryParams);
      }

      setFilteredCalls(filteredCalls);
    }
  }, [calls, directionQueryParams, typeQueryParams]);

  const sortedCalls = useMemo(() => {
    console.log('sortedCalls');
    const clone = JSON.parse(JSON.stringify(filteredCalls));

    return clone.sort((a: Call, b: Call) => {
      if (a.created_at > b.created_at) return -1;
      if (a.created_at < b.created_at) return 1;
      return 0;
    });
  }, [filteredCalls]);

  //
  const groupedCalls = sortedCalls
    .reduce((acc: { [key: string]: Call[] }, call: Call, index: number) => {
      if (index < (activePage - 1) * callsPerPage || index >= activePage * callsPerPage) return acc;
      const date = new Date(call.created_at);
      const day = date.toLocaleDateString();
      if (!acc[day]) {
        acc[day] = [call];
      } else {
        acc[day].push(call);
      }
      return acc;
    }, {});

  if (loading) return <SpinnerOutlined />;
  if (error) return <p>ERROR</p>;
  if (!data) return <EmptyCallListItem />;

  const handlePageChange = (page: number) => {
    if (page === activePage) return;
    setSearchParams(params => {
      params.set('page', page.toString());
      return params;
    });

    navigate(`/calls/?${searchParams.toString()}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearchParams(params => {
      params.set('page', '1');
      if (pageSize === CALLS_PER_PAGE || !pageSize) params.delete('cpe');
      else params.set('cpe', pageSize.toString());
      return params;
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <CallsFilterBar />
      <Box overflow="auto" minWidth={400} paddingTop={5} maxHeight="80vh">
        <Accordion.Root defaultSelected={1}>
          {Object.keys(groupedCalls).map((day: string, index: number) => (
            <Accordion.Item id={index} key={day}>
              <Accordion.Header>
                <Flex justifyContent="center" alignItems="center">
                  <Typography variant="heading2" textAlign="center" color="grey" paddingTop={2}>
                    {day}
                  </Typography>
                  <ArrowDownFilled size={20} />
                </Flex>
              </Accordion.Header>
              <Accordion.Body>
                <Spacer space={3} direction="vertical" minWidth="100%">
                  {groupedCalls[day].map((call: Call) => (
                    <CallListItem call={call} key={call.id} />
                  ))}
                </Spacer>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Box>
      {Array.isArray(calls) && calls.length && (
        <Box>
          <PaginationWrapper>
            <Pagination
              activePage={activePage}
              pageSize={callsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              defaultPageSize={CALLS_PER_PAGE}
              recordsTotalCount={filteredCalls.length}
            />
          </PaginationWrapper>
        </Box>
      )}
    </>
  );
};
