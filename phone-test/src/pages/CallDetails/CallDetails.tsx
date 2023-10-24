import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../../gql/queries/getCallDetails';
import { Box, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  if (loading)
    return (
      <Typography py={4} variant="displayM">
        Loading call details...
      </Typography>
    );
  if (error)
    return (
      <Typography py={4} variant="displayM">
        Error
      </Typography>
    );

  const { call } = data;

  return (
    <>
      <Typography py={4} variant="displayM">
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
          return <div key={index}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
    </>
  );
};
