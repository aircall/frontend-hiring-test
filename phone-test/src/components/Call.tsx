import {
  Grid,
  Icon,
  Typography,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';

enum CallType {
  MISSED = 'missed',
  ANSWERED = 'answered',
  VOICEMAIL = 'voicemail'
}

export const Call = ({ onClick, call }: { call: Call; onClick: (id: string) => void }) => {
  const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
  const title =
    call.call_type === CallType.MISSED
      ? 'Missed call'
      : call.call_type === CallType.ANSWERED
      ? 'Call answered'
      : 'Voicemail';

  const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
  const duration = formatDuration(call.duration / 1000);
  const date = formatDate(call.created_at);
  const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

  return (
    <Box
      key={call.id}
      bg="black-a30"
      borderRadius={16}
      cursor="pointer"
      onClick={() => onClick(call.id)}
    >
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
          <Typography variant="caption">{date}</Typography>
        </Box>
      </Grid>
      <Box px={4} py={2}>
        <Typography variant="caption">{notes}</Typography>
      </Box>
    </Box>
  );
};
