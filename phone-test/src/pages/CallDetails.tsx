import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Spacer } from '@aircall/tractor';
import styled from 'styled-components';
import Loader from '../components/Layout/Loader';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { ARCHIVE_CALL } from '../gql/mutations';
import { CALLS_SUBSCRIPTION } from '../gql/subscriptions';
import { formatDate, formatDuration } from '../helpers/dates';

export const CallDetailsPageWrapper = styled.div`
  height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 16px;
  }

  .text-color--orange {
    color: #ff854c;
  }
  .text-color--blue {
    color: #83b2ee;
  }
`;

export const CallDetailsPage = () => {
  const navigate = useNavigate();
  const { callId } = useParams();

  const [
    archiveCallMutation,
    { loading: archiveCallMutationLoading, error: archiveCallMutationError }
  ] = useMutation(ARCHIVE_CALL, {
    update(cache, { data }) {
      const { archiveCall } = data;
      cache.writeQuery({
        query: GET_CALL_DETAILS,
        data: {
          call: archiveCall
        }
      });
    }
  });

  const { loading, error, data, subscribeToMore } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  const handleOnArchiveCall = (callId: string | number): void => {
    archiveCallMutation({ variables: { id: callId } });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: CALLS_SUBSCRIPTION,
      updateQuery: (prevData, { subscriptionData }) => {
        if (!subscriptionData.data) return prevData;
        const {
          data: { onUpdatedCall }
        } = subscriptionData;

        return {
          call: onUpdatedCall
        };
      }
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  if (loading || (archiveCallMutationLoading && !data.call))
    return <Loader message="Loading call details..." />;
  if (error || archiveCallMutationError) return <p>ERROR</p>;

  const { call } = data;

  return (
    <CallDetailsPageWrapper>
      <div className="page-header">
        <Button name="btn-back" size="xSmall" mode="link" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="displayM" textAlign="center" py={3} flexGrow={1}>
          Calls Details
        </Typography>
      </div>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <div>{`ID: ${call.id}`}</div>
        <div>{`Type: ${call.call_type}`}</div>
        <div>{`Created at: ${formatDate(call.created_at)}`}</div>
        <div>{`Direction: ${call.direction}`}</div>
        <div>{`From: ${call.from}`}</div>
        <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
        <Spacer>
          <span>Is archived:</span>
          <Typography className={`${call.is_archived ? 'text-color--orange' : 'text-color--blue'}`}>
            {call.is_archived ? 'Archived' : 'No archived'}
          </Typography>
        </Spacer>
        <div>{`To: ${call.to}`}</div>
        <div>{`Via: ${call.via}`}</div>
        {call.notes?.map((note: Note, index: number) => {
          return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
        <Spacer my={4}>
          <Button name="btn-archive-call" size="small" onClick={() => handleOnArchiveCall(call.id)}>
            {call.is_archived ? `Unarchive call` : `Archive call`}
          </Button>
        </Spacer>
      </Box>
    </CallDetailsPageWrapper>
  );
};
