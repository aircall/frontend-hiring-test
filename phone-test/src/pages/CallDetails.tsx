import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../gql/queries/getCallDetails';
import { Banner, Box, Flex, Icon, SpinnerOutlined, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  if (loading) return <p>Loading call details...</p>;

  const { call } = data;

  return (
    <>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      {loading && (
        <Flex justifyContent="center" m={6}>
          <Icon component={SpinnerOutlined} spin />
        </Flex>
      )}

      {call ? (
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
        </Box>
      ) : (
        <Banner.Root variant="error" mt={40}>
          <Banner.Icon />
          <Box>
            <Banner.Heading mb={1}>We could not find the call data</Banner.Heading>
            <Banner.Paragraph mb={1}>
              The call you were trying to view does not exist. If you think this is a mistake,
              please contact support.aircall.io
            </Banner.Paragraph>
          </Box>
        </Banner.Root>
      )}
    </>
  );
};
