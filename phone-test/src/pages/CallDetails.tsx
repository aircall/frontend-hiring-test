import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Box, Button, Typography, useToast } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { ARCHIVE_CALL } from '../gql/mutations/calls';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });
  const { showToast } = useToast();

  const [archiveCall] = useMutation(ARCHIVE_CALL);

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  const { call } = data;

  const handleArchive = async () => {
    try {
      await archiveCall({ variables: { id: call.id } });
      showToast({
        message: 'Call archived successfully!',
        variant: 'success',
        dismissIn: 3000
      });
      navigate('/calls');
    } catch (error) {
      console.error('Error archiving call:', error);
    }
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
          return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
      <Button size="xSmall" variant="destructive" onClick={handleArchive}>
        Archive call
      </Button>
    </>
  );
};
