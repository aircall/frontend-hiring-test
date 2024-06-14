import { useQuery, useSubscription } from "@apollo/client";
import styled from "styled-components";
import { PAGINATED_CALLS } from "../../gql/queries";
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Pagination
} from "@aircall/tractor";
import { formatDate, formatDuration } from "../../helpers/dates";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import { format } from "date-fns";
import { ON_UPDATED_CALL } from "../../gql/subscriptions";
import useRedirectToLogin from "../../hooks/useRedirectToLogin";
import Filters from "./Filters";

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

type Results = { paginatedCalls: { nodes: Call[]; totalCount: number; hasNextPage: boolean } };

const CALLS_PER_PAGE = 25;

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const pageQueryParams = search.get("page");
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const [pageSize, setPageSize] = useState(CALLS_PER_PAGE);

  const { loading, error, data, refetch } = useQuery<Results>(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * pageSize,
      limit: pageSize,
      direction: "inbound"
    }
    // onCompleted: () => handleRefreshToken(),
  });

  const { data: subscriptionData } = useSubscription(ON_UPDATED_CALL);

  useEffect(() => {
    if (subscriptionData) {
      refetch();
    }
  }, [subscriptionData, refetch]);

  useRedirectToLogin(error);

  const [filter, setFilter] = useState({ call_type: "", direction: "" });

  const filteredCalls = useMemo(
    () =>
      data?.paginatedCalls.nodes.filter(call => {
        return (
          call.is_archived &&
          (filter.call_type === "" || call.call_type === filter.call_type) &&
          (filter.direction === "" || call.direction === filter.direction)
        );
      }),
    [data, filter]
  );

  const groupedCalls = useMemo(
    () =>
      groupBy(
        orderBy(filteredCalls, call => call.created_at, "desc"),
        call => format(new Date(call.created_at), "MMM dd, yyyy")
      ),
    [filteredCalls]
  );

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>You aren't authorized to view this page</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount } = data.paginatedCalls;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>
      <Filters filter={filter} setFilter={setFilter} />
      <Spacer space={3} direction="vertical">
        {Object.entries(groupedCalls).map(([date, calls]) => {
          return (
            <Grid key={date} marginTop={10} gap={2} paddingBottom={20} borderBottom="1px solid">
              <Typography variant="displayS" textAlign="center" py={3}>
                {date}
              </Typography>
              <Grid>
                {calls.map((call: Call, i) => {
                  const icon =
                    call.direction === "inbound" ? DiagonalDownOutlined : DiagonalUpOutlined;
                  const title =
                    call.call_type === "missed"
                      ? "Missed call"
                      : call.call_type === "answered"
                      ? "Call answered"
                      : "Voicemail";
                  const subtitle =
                    call.direction === "inbound" ? `from ${call.from}` : `to ${call.to}`;
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
                      id={`call-${i}`}
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
              </Grid>
            </Grid>
          );
        })}
      </Spacer>

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            onPageSizeChange={handlePageSizeChange}
            activePage={activePage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
