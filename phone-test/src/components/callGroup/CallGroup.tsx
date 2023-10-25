import {
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Grid,
  Icon,
  Spacer,
  Typography
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates/dates';

interface CallGroupProps {
  calls: Array<Call>;
  date: string;
  onCall: (id: string) => void;
}

export const CallGroup = ({ calls, date, onCall }: CallGroupProps) => (
  <Spacer direction="vertical" key={date} space={2} w="100%">
    <Typography variant="displayS" py={1}>
      {date}
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
      const duration = formatDuration(call.duration / 1000);
      const date = formatDate(call.created_at);
      const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;
      return (
        <Box
          bg="black-a30"
          borderRadius={16}
          cursor="pointer"
          key={call.id}
          onClick={() => onCall(call.id)}
        >
          <Grid
            alignItems="center"
            borderBottom="1px solid"
            borderBottomColor="neutral-700"
            columnGap={2}
            gridTemplateColumns="32px 1fr max-content"
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
              <Typography variant="caption">{date}</Typography>
            </Box>
          </Grid>
          <Box px={4} py={2}>
            <Typography variant="caption">{notes}</Typography>
          </Box>
        </Box>
      );
    })}
  </Spacer>
);
