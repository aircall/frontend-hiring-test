import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { ARCHIVE_CALL } from '../gql/mutations';
import { Box, Typography, Button, Spacer } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  const [archiveCallMutation] = useMutation(ARCHIVE_CALL);

  const handleOnArchiveCall = (callId: string | number): void => {
    archiveCallMutation({
      variables: { id: callId },
      onCompleted: () => {
        refetch();
      }
    });
  };

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

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
        <Spacer>
          <span>Is archived:</span>
          <Typography color={`${call.is_archived ? '#FF854C' : '#83B2EE'}`}>
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
    </>
  );
};
