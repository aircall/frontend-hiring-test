import { useMutation, useQuery, useSubscription } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../../gql/queries';
import { Typography, Pagination, useToast } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARCHIVE } from '../../gql/mutations/archive';
import { CallComponent } from '../../components/Call';
import { useEffect, useState } from 'react';
import { UPDATE_CALL } from '../../gql/subscriptions/updateCall';
import { REFRESH_TOKEN } from '../../gql/mutations/refreshToken';
import { useRefresh } from '../../hooks/useRefresh';
import { useAuth } from '../../hooks/useAuth';

export const PaginationWrapper = styled.div`
  > div {
    width: inherit;
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;

const CALLS_PER_PAGE = 5;

export const CallsListPage = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const pageQueryParams = search.get('page');
  const [calls, setCalls] = useState<Array<Call>>([]);
  const [skipSubscription, setSkipSubscription] = useState(true);
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;

  const { data: updatedCall } = useSubscription(UPDATE_CALL, {
    skip: skipSubscription
  });

  const [archiveCall] = useMutation(ARCHIVE);

  const { loading, data, refetch } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * CALLS_PER_PAGE,
      limit: CALLS_PER_PAGE
    },
    onCompleted: (data) => {
      setCalls(data.paginatedCalls.nodes);
    },
    onError: (error) => {
      // call refresh token when we get an error of unauthorized.
      refresh().then(() => refetch()).catch(() => {
        logout(true);
      })
    }
  });
  const refresh = useRefresh()

  useEffect(() => {
    if (updatedCall) {
      setCalls((calls) => {
        const newState = [...calls];
        const targetCallIndex = newState.findIndex(call => call.id === updatedCall.onUpdatedCall.id)
        newState[targetCallIndex] = updatedCall.onUpdatedCall
        return newState;
      });
      setSkipSubscription(true);
    }
  }, [updatedCall])

  if (loading) return <p>Loading calls...</p>;
  // if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount } = data?.paginatedCalls;

  const handleCallOnClick = (callId: Call['id']) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handleArchiveCall = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: Call['id']) => {
    e.stopPropagation();
    setSkipSubscription(false);
    archiveCall({
      variables: { id },
      onError: (error) => {
        showToast({
          id: 'ARCHIVE_FAIL',
          message: error.message,
          variant: 'error',
          dismissIn: 3000,
        })
      }
    })
  }

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls History
      </Typography>

      <CallComponent calls={calls} handleArchiveCall={handleArchiveCall} handleCallOnClick={handleCallOnClick} />

      {totalCount && (
        <PaginationWrapper>
          <Pagination
            activePage={activePage}
            pageSize={CALLS_PER_PAGE}
            onPageChange={handlePageChange}
            recordsTotalCount={totalCount}
          />
        </PaginationWrapper>
      )}
    </>
  );
};
