import { DiagonalDownOutlined, DiagonalUpOutlined, Spacer, Typography } from '@aircall/tractor';
import { MouseEvent } from 'react';
import { formatDate, formatDuration } from '../../helpers/dates/dates';
import { Call } from '../call/Call';

interface CallGroupProps {
  calls: Array<Call>;
  date: string;
  onArchive: (event: MouseEvent, id: string) => void;
  onCall: (id: string) => void;
}

export const CallGroup = ({ calls, date, onArchive, onCall }: CallGroupProps) => (
  <Spacer direction="vertical" key={date} space={2} w="100%">
    <Typography variant="displayS" py={1}>
      {date}
    </Typography>
    {calls.map(
      ({ call_type, created_at, direction, duration, from, id, is_archived, notes, to }: Call) => {
        const isAnswered = call_type === 'answered';
        const isInbound = direction === 'inbound';
        const isMissed = call_type === 'missed';
        return (
          <Call
            date={formatDate(created_at)}
            duration={formatDuration(duration / 1000)}
            icon={isInbound ? DiagonalDownOutlined : DiagonalUpOutlined}
            isArchived={is_archived}
            key={id}
            notes={notes ? `Call has ${notes.length} notes` : ''}
            onArchive={event => onArchive(event, id)}
            onCall={() => onCall(id)}
            subtitle={isInbound ? `from ${from}` : `to ${to}`}
            title={isMissed ? 'Missed call' : isAnswered ? 'Call answered' : 'Voicemail'}
          />
        );
      }
    )}
  </Spacer>
);
