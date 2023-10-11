import { useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { PAGINATED_CALLS } from '../gql/queries';
import { Typography, Pagination } from '@aircall/tractor';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARCHIVE } from '../gql/mutations/archive';
import { CallComponent } from '../components/Call';
import { useBroadcastChannel } from '../hooks/useBroadcastChannel';

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
  const pageQueryParams = search.get('page');
  const activePage = !!pageQueryParams ? parseInt(pageQueryParams) : 1;
  const { loading, error, data, refetch } = useQuery(PAGINATED_CALLS, {
    variables: {
      offset: (activePage - 1) * CALLS_PER_PAGE,
      limit: CALLS_PER_PAGE
    }
    // onCompleted: () => handleRefreshToken(),
  });
  const [archiveCall] = useMutation(ARCHIVE);
  const { broadcast } = useBroadcastChannel('updateList', (data: MessageEvent<any>) => {
    if (data.data.archived) {
      refetch()
    }
  });

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  const { totalCount, nodes: calls } = data.paginatedCalls;

  const handleCallOnClick = (callId: Call['id']) => {
    navigate(`/calls/${callId}`);
  };

  const handlePageChange = (page: number) => {
    navigate(`/calls/?page=${page}`);
  };

  const handleArchiveCall = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: Call['id']) => {
    e.stopPropagation();
    archiveCall({
      variables: { id },
      onCompleted: (data) => {
        broadcast({ archived: true })
        refetch()
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
