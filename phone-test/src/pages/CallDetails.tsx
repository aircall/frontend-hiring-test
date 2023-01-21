import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Box, Button, Icon, SpinnerOutlined, Typography, useToast } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { ARCHIVE_CALL } from '../gql/mutations';
import { CALL_SUBSCRIPTION } from '../gql/subscriptions';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { showToast } = useToast();

  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  const [archiveCall, { loading: archiveCallLoading }] = useMutation(ARCHIVE_CALL);

  useSubscription(CALL_SUBSCRIPTION);

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  const { call } = data;
  const { id, is_archived: isArchived } = call;

  const onArchive = async () => {
    try {
      await archiveCall({ variables: { id } });
      showToast({
        message: `The call was successfully ${isArchived ? 'restored' : 'archived'}.`,
        variant: 'success',
        dismissIn: 2500
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: 'An error occurred. Please try again later.',
        variant: 'error',
        dismissIn: 2500
      });
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
