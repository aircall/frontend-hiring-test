import {
  Grid,
  Icon,
  Typography,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined
} from '@aircall/tractor';
import { formatDate, formatDuration } from '../helpers/dates';
import { useNavigate } from 'react-router-dom';

export const Call = ({ call }: { call: Call }) => {
  const navigate = useNavigate();

  const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
  const callTypeTitles: Record<string, string> = {
    missed: 'missed',
    answered: 'answered',
    voicemail: 'voicemail'
  };

  const title = callTypeTitles[call.call_type] || 'Unknown call type';
  const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
  const duration = formatDuration(call.duration / 1000);
  const date = formatDate(call.created_at);
  const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  return (
    <Box
      data-cy="call-detail"
      key={call.id}
      bg="black-a30"
      borderRadius={16}
      cursor="pointer"
      onClick={() => handleCallOnClick(call.id)}
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
