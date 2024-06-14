import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GET_CALL_DETAILS } from "../gql/queries/getCallDetails";
import { Box, Button, Grid, Typography, useToast } from "@aircall/tractor";
import { formatDate, formatDuration } from "../helpers/dates";
import { ARCHIVE_CALL } from "../gql/mutations/calls";
import useRedirectToLogin from "../hooks/useRedirectToLogin";

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });
  const { showToast } = useToast();

  const [archiveCall, { error: archiveCallError }] = useMutation(ARCHIVE_CALL);

  // Redirect to log in if user is not authenticated
  useRedirectToLogin(error || archiveCallError);

  if (loading) return <p>Loading call details...</p>;
  if (error) return <p>You aren't authorized to view this page</p>;

  const { call } = data;

  if (!call) return <p>Couldn't find call with id {callId}</p>;

  const handleArchive = async () => {
    try {
      await archiveCall({ variables: { id: call.id } });
      showToast({
        message: "Call archived successfully!",
        variant: "success",
        dismissIn: 3000
      });
      navigate("/calls");
    } catch (error) {
      console.error("Error archiving call:", error);
    }
  };

  return (
    <>
      <Link to="/calls">
        <Typography py={3}>← Back to calls</Typography>
      </Link>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>

      <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
        <div>{`ID: ${call.id}`}</div>
        <div>{`Type: ${call.call_type}`}</div>
        <div>{`Created at: ${formatDate(call.created_at)}`}</div>
        <div>{`Direction: ${call.direction}`}</div>
        <div>
          <a href={`tel:${call.from}`}>{`From: ${call.from}`}</a>
        </div>
        <div>{`Duration: ${formatDuration(call.duration / 1000)}`}</div>
        <div>{`Is archived: ${call.is_archived}`}</div>
        <div>
          <a href={`tel:${call.to}`}>{`To: ${call.to}`}</a>
        </div>
        <div>
          <a href={`tel:${call.via}`}>{`Via: ${call.via}`}</a>
        </div>
        {call.notes?.map((note: Note, index: number) => {
          return <div key={note.id}>{`Note ${index + 1}: ${note.content}`}</div>;
        })}
      </Box>
      <Grid display="inline-block" marginLeft="1rem">
        <Button size="xSmall" variant="destructive" onClick={handleArchive}>
          Archive call
        </Button>
      </Grid>
    </>
  );
};
