import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CALL_DETAILS } from '../../gql/queries/getCallDetails';
import { Box, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates';
import { PageWrapper } from '../../components';
import { DetailItem } from './components/DetailItem';

export const CallDetailsPage = () => {
  const { callId } = useParams();
  const { loading, error, data } = useQuery(GET_CALL_DETAILS, {
    variables: {
      id: callId
    }
  });

  return (
    <PageWrapper isLoading={loading} error={error} data={data}>
      <Typography variant="displayM" textAlign="center" py={3}>
        Calls Details
      </Typography>
      {data && (
        <Box overflowY="auto" bg="black-a30" p={4} borderRadius={16}>
          <DetailItem label="ID" value={data.call.id} />
          <DetailItem label="Type" value={data.call.call_type} />
          <DetailItem label="Created at" value={formatDate(data.call.created_at)} />
          <DetailItem label="Direction" value={data.call.direction} />
          <DetailItem label="From" value={data.call.from} />
          <DetailItem label="Duration" value={formatDuration(data.call.duration / 1000)} />
          <DetailItem label="Is archived" value={data.call.is_archived.toString()} />
          <DetailItem label="To" value={data.call.to} />
          <DetailItem label="Via" value={data.call.via} />
          {data.call.notes?.map((note: Note, index: number) => (
            <DetailItem key={index} label={`Note ${index + 1}`} value={note.content} />
          ))}
        </Box>
      )}
    </PageWrapper>
  );
};
