import {
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined,
  Grid,
  Icon,
  Typography
} from '@aircall/tractor';
import { formatDate, formatDuration } from 'helpers/dates';
import { useNavigate } from 'react-router-dom';

interface CallListItemProps {
  call: Call;
}

const CallListItem = ({ call }: CallListItemProps) => {
  const navigate = useNavigate();

  const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
  const callTypeTitles: Record<string, string> = {
    missed: 'Missed call',
    answered: 'Call answered',
    voicemail: 'Voicemail'
  };
  const title = callTypeTitles[call.call_type] || 'Unknown call type';
  const callTypesColors: Record<string, string> = {
    missed: 'red-500',
    answered: 'green-500',
    voicemail: 'blue-500'
  };
  const color = callTypesColors[call.call_type] || 'neutral-600';
  const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
  const duration = formatDuration(call.duration / 1000);
  const date = formatDate(call.created_at);
  const notes = call.notes ? `Call has ${call.notes.length} notes` : <></>;

  const handleCallOnClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };

  return (
    <Box
      key={call.id}
      bg="black-a30"
      borderRadius={16}
      cursor="pointer"
      id={`${call.id}`}
      data-test="call"
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
          <Icon component={icon} size={32} color={color} />
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

export default CallListItem;
