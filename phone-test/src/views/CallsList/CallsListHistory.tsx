import {
  Box,
  Button,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Flex,
  Grid,
  Icon,
  Spacer,
  Typography
} from '@aircall/tractor';
import { formatDuration } from 'date-fns';
import { formatDate, formatDateAsDay } from '../../helpers/dates';
import { ApolloError } from '@apollo/client';
import { PropsWithChildren } from 'react';

interface Call {
  id: string;
  direction: 'inbound' | 'outbound';
  call_type: 'missed' | 'answered' | 'voicemail';
  duration: number;
  from: string;
  to: string;
  created_at: string;
  notes?: string[];
  is_archived?: boolean;
}

interface CallsListHistoryProps {
  calls: Call[];
  handleCallOnClick: (callId: string) => void;
  loading: boolean;
  error?: ApolloError;
  callTypeFilter: string;
  directionFilter: string;
}

const CallListHistoryContainer = ({ children }: PropsWithChildren) => (
  <Spacer space={3} direction="vertical">
    {children}
  </Spacer>
);

const groupCallsByDate = (calls: Call[]) => {
  const groups = calls.reduce((groups, call) => {
    const date = new Date(call.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(call);
    return groups;
  }, {} as { [key: string]: Call[] });
  return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
};
const CallsListHistory = ({
  calls,
  handleCallOnClick,
  loading,
  error,
  callTypeFilter,
  directionFilter
}: CallsListHistoryProps) => {
  // We need to filter in the client because the API
  // does not allow filtering parameters in the mutation
  const filteredCalls = calls.filter(call => {
    return (
      (callTypeFilter === '' || call.call_type === callTypeFilter) &&
      (directionFilter === '' || call.direction === directionFilter)
    );
  });

  const groupedCalls = groupCallsByDate(filteredCalls);

  if (loading)
    return (
      <CallListHistoryContainer>
        <p>Loading calls...</p>
      </CallListHistoryContainer>
    );
  if (error) return <CallListHistoryContainer>ERROR</CallListHistoryContainer>;

  return (
    <CallListHistoryContainer>
      <Flex flex={1} display="column" overflowY={'scroll'} maxHeight={'70vh'}>
        {groupedCalls.map(([date, calls]) => (
          <Box key={date} mb={4}>
            <Typography pt={4} variant="subheading" px={'1.25rem'} color="#01B288" mb={1}>
              {formatDateAsDay(date)}
            </Typography>
            {calls.map((call: Call) => {
              const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
              const title =
                call.call_type === 'missed'
                  ? 'Missed call'
                  : call.call_type === 'answered'
                  ? 'Call answered'
                  : 'Voicemail';
              const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
              const duration = formatDuration((call.duration / 1000) as Duration);
              const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

              return (
                <Box key={call.id} bg="black-a30" borderRadius={16} cursor="pointer" mb={2}>
                  <Grid
                    gridTemplateColumns="32px 1fr max-content"
                    columnGap={2}
                    borderBottom="1px solid"
                    borderBottomColor="neutral-700"
                    alignItems="center"
                    px={4}
                    py={2}
                  >
                    <Box>
                      <Icon component={icon} size={32} />
                    </Box>
                    <Box>
                      <Typography variant="body">{title}</Typography>
                      <Typography variant="body2">{subtitle}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" textAlign="right">
                        {duration}
                      </Typography>
                      <Typography variant="caption">{formatDate(call.created_at)}</Typography>
                    </Box>
                  </Grid>
                  <Box p={4}>
                    <Typography variant="caption">{notes}</Typography>
                  </Box>
                  <Flex justifyContent="end" style={{ gap: '1rem' }}>
                    <Button
                      data-testid="call-details"
                      size="xSmall"
                      onClick={() => handleCallOnClick(call.id)}
                    >
                      Call details
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        ))}
      </Flex>
    </CallListHistoryContainer>
  );
};

export { CallsListHistory };
