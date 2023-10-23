import { useMutation, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from 'gql/queries/getCallDetails';
import { ArchiveFilled, ArrowLeftFilled, Box, Button, Spacer, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from 'helpers/dates';
import { ARCHIVE_CALL } from 'gql/mutations/archive';
import { useEffect } from 'react';
import { useCustomToast } from 'hooks/useCustomToast';
import Spinner from 'components/spinner/spinner';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });
  const { showToast } = useCustomToast();
  const [archiveMutation] = useMutation(ARCHIVE_CALL);

  // Refecth data when tab is visible
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

  if (loading) return <Spinner />;
  if (error) {
    showToast({
      id: 'CALL_DETAILS_ERROR',
      message: 'There was an error fetching the call details',
      variant: 'error'
    });
    console.error(error.message);
    return <></>;
  }

  const { call } = data;

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
      <Typography variant="displayM" textAlign="center" py={3} className="title">
        Calls Details
      </Typography>
      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <div id="callid">{`ID: ${call.id}`}</div>
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
      <Spacer spaceX={4}>
        <Link to="/calls">
          <Button variant="primary" size="small">
            <ArrowLeftFilled /> Back
          </Button>
        </Link>
        <Button variant="destructive" size="small" onClick={handleArchive}>
          <ArchiveFilled /> Archive
        </Button>
      </Spacer>
    </>
  );
};
