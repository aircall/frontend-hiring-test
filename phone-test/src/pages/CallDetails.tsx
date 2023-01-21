import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Box, Button, Icon, SpinnerOutlined, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { ARCHIVE_CALL } from '../gql/mutations';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  const [archiveCall, { loading: archiveCallLoading }] = useMutation(ARCHIVE_CALL);

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  const { call } = data;
  const { id, is_archived: isArchived } = call;

  const onArchive = async () => {
    try {
      await archiveCall({ variables: { id } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16} data-testid="call-detail" mb={3}>
        <div>{`ID: ${id}`}</div>
        <div>{`Type: ${call.call_type}`}</div>
        <div>{`Created at: ${formatDate(call.created_at)}`}</div>
        <div>{`Direction: ${call.direction}`}</div>
        <div>{`From: ${call.from}`}</div>
        <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
        <div>{`Is archived: ${isArchived}`}</div>
        <div>{`To: ${call.to}`}</div>
        <div>{`Via: ${call.via}`}</div>
        {call.notes?.map((note: Note, index: number) => {
          return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
      <Button
        disabled={archiveCallLoading}
        onClick={onArchive}
        variant={isArchived ? 'instructive' : 'destructive'}
      >
        {archiveCallLoading ? <Icon component={SpinnerOutlined} spin /> : null}
        {isArchived ? 'Restore call' : 'Archive call'}
      </Button>
    </>
  );
};
