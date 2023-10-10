import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../../gql/queries/getCallDetails';
import { Box, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { CallDetailsForm } from './CallDetailsForm';
import { ON_UPDATED_CALL } from '../../gql/subscriptions';
import { useCallback } from 'react';

export const CallDetailsPage = () => {
  const { callId = '' } = useParams();
  const { loading, error, data, subscribeToMore } = useQuery<
    {
      call: Call;
    },
    { id: string }
  >(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  const subscribeToUpdated = useCallback(() => {
    subscribeToMore({
      document: ON_UPDATED_CALL,
      onError: error => console.log(error)
    });
  }, [subscribeToMore]);

  if (loading) return <p>Loading call details...</p>;
  if (error || !data?.call) return <p>ERROR</p>;

  const { call } = data;

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <div>{`ID: ${call.id}`}</div>
        <div>{`Type: ${call.call_type}`}</div>
        <div>{`Created at: ${formatDate(call.created_at)}`}</div>
        <div>{`Direction: ${call.direction}`}</div>
        <div>{`From: ${call.from}`}</div>
        <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
        <div>{`Is archived: ${call.is_archived}`}</div>
        <div>{`To: ${call.to}`}</div>
        <div>{`Via: ${call.via}`}</div>
        {call.notes?.map((note: Note, index: number) => {
          return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
      <CallDetailsForm
        id={call.id}
        isArchived={call.is_archived}
        subscribeToUpdates={subscribeToUpdated}
      />
    </>
  );
};
