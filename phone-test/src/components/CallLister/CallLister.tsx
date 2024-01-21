import { formatDate, formatDuration, getValidDate } from '../../helpers/dates';
import {
  Grid,
  Icon,
  Typography,
  Spacer,
  Box,
  DiagonalDownOutlined,
  DiagonalUpOutlined
} from '@aircall/tractor';
import groupBy from '../../utils/group-array';

interface Note {
  id: string;
  content: string;
}

interface Call {
  id: string;
  direction: string;
  from: string;
  to: string;
  duration: number;
  is_archived: boolean;
  call_type: string;
  via: string;
  created_at: string;
  notes: Note[];
}

export interface CallListerProps {
  calls: Call[];
  onCallClick: (callId: string) => void;
}
export default function CallLister({ calls, onCallClick }: CallListerProps) {
  const groupedCalls = groupBy(calls, ({ created_at }) => {
    const callDate = new Date(created_at);
    const callDay = callDate.getDate();
    const callMonth = callDate.toLocaleString('default', { month: 'short' });
    return `${callDay} ${callMonth}`;
  });

  const dividedCallsList: Array<string | Call> = [];
  for (const key in groupedCalls) {
    if (!dividedCallsList.includes(key)) {
      dividedCallsList.push(key);
    }

    groupedCalls[key].forEach(call => {
      dividedCallsList.push(call);
    });
  }

  return (
    <Spacer space={3} direction="vertical">
      {dividedCallsList.map((item: string | Call) => {
        if (typeof item === 'string') {
          return <Typography variant="displayM2">Calls on {item}</Typography>;
        }

        const icon = item.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
        const title =
          item.call_type === 'missed'
            ? 'Missed call'
            : item.call_type === 'answered'
            ? 'Call answered'
            : 'Voicemail';
        const subtitle = item.direction === 'inbound' ? `from ${item.from}` : `to ${item.to}`;
        const duration = formatDuration(item.duration / 1000);
        const date = formatDate(item.created_at);
        const notes = item.notes ? `Call has ${item.notes.length} notes` : <></>;

        return (
          <Box
            key={item.id}
            bg="black-a30"
            borderRadius={16}
            cursor="pointer"
            onClick={() => onCallClick(item.id)}
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
      })}
    </Spacer>
  );
}
