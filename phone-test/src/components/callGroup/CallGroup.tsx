import { DiagonalDownOutlined, DiagonalUpOutlined, Spacer, Typography } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../helpers/dates/dates';
import { Call } from '../call/Call';

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
      const date = formatDate(call.created_at);
      const duration = formatDuration(call.duration / 1000);
      const icon = call.direction === 'inbound' ? DiagonalDownOutlined : DiagonalUpOutlined;
      const notes = call.notes ? `Call has ${call.notes.length} notes` : '';
      const subtitle = call.direction === 'inbound' ? `from ${call.from}` : `to ${call.to}`;
      const title =
        call.call_type === 'missed'
          ? 'Missed call'
          : call.call_type === 'answered'
          ? 'Call answered'
          : 'Voicemail';
      return (
        <Call
          date={date}
          duration={duration}
          icon={icon}
          notes={notes}
          onCall={() => onCall(call.id)}
          subtitle={subtitle}
          title={title}
        />
      );
    })}
  </Spacer>
);
