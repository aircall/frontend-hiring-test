import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { ArchiveFilled, Box, Button, Icon, SpinnerOutlined, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { ARCHIVE_CALL } from '../gql/mutations/archive';
import { useEffect } from 'react';

const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });
  const [archiveMutation, archiveState] = useMutation(ARCHIVE_CALL);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>ERROR</p>;

  const { call } = data;
  if (call === null) return <p>Not found</p>;

  const handleArchive = async () => {
    archiveMutation({
      variables: {
        id: callId
      },
      onError: error => {
        console.log(error);
      }
    });
  };

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3} data-cy="call-details-title">
        Calls Details
      </Typography>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <Typography variant="heading">{`ID: ${call.id}`}</Typography>
      </Box>

      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <Typography variant="subheading">{`Type: ${call.call_type}`}</Typography>
        <Typography variant="subheading">{`Created at: ${formatDate(call.created_at)}`}</Typography>
        <Typography variant="subheading">{`Direction: ${call.direction}`}</Typography>
        <Typography variant="subheading">{`From: ${call.from}`}</Typography>
        <Typography variant="subheading">{`Duration: ${formatDuration(
          call.duration / 1000
        )}`}</Typography>
        <Typography variant="subheading">{`Is archived: ${call.is_archived}`}</Typography>
        <Typography variant="subheading">{`To: ${call.to}`}</Typography>
        <Typography variant="subheading">{`Via: ${call.via}`}</Typography>
      </Box>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <Typography variant="subheading">Notes</Typography>
        {call.notes?.map((note: Note, index: number) => (
          <Typography variant="body" key={note.id}>{`Note ${index + 1}: ${
            note.content
          }`}</Typography>
        ))}
      </Box>
      <Button
        variant={call.is_archived ? 'instructive' : 'destructive'}
        disabled={archiveState.loading}
        size="small"
        onClick={handleArchive}
      >
        {archiveState.loading ? <Icon component={SpinnerOutlined} spin /> : <ArchiveFilled />}{' '}
        {call.is_archived ? 'Unarchive' : 'Archive'}
      </Button>
    </>
  );
};
export default CallDetailsPage;
