import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ARCHIVE_CALLS, GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Box, Button, Typography } from '@aircall/tractor';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDuration } from '../helpers/dates';
import { useEffect } from 'react';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data, startPolling, stopPolling } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    },
    pollInterval: 1000
  });
  
  const [archiveCalls] = useMutation(ARCHIVE_CALLS);

  useEffect(() => {
    startPolling(5000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (error?.message === 'Unauthorized') {
    navigate('/login');
  }

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  
  const { call } = data;
  const handleArchive = () => {
    return archiveCalls({
      variables: { id: callId }
    });
  };

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
          return <div>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
        <Button style={{ marginTop: 8 }} onClick={handleArchive}>
          {call.is_archived ? 'Un Archive' : 'Archive'}
        </Button>
      </Box>
    </>
  );
};
