import { DiagonalDownOutlined, DiagonalUpOutlined } from '@aircall/tractor';
import { formatDate, formatDuration } from '../../../../helpers/dates';
import { CallType, Direction } from '../../../../declarations/enums';

const callIcons: Record<Direction, React.ElementType> = {
  [Direction.Inbound]: DiagonalDownOutlined,
  [Direction.Outbound]: DiagonalUpOutlined
};

const callTitles: Record<CallType, string> = {
  [CallType.Missed]: 'Missed call',
  [CallType.Answered]: 'Call answered',
  [CallType.Voicemail]: 'Voicemail'
};

export const getCallSubtitle = (direction: Direction, from: string, to: string): string =>
  direction === Direction.Inbound ? `from ${from}` : `to ${to}`;

export const getCallNotes = (notes: Note[]): string | null =>
  notes.length ? `Call has ${notes.length} notes` : null;

export const transformData = ({
  direction,
  call_type,
  from,
  to,
  duration,
  created_at,
  notes
}: Call) => ({
  icon: callIcons[direction as Direction],
  title: callTitles[call_type as CallType],
  subtitle: getCallSubtitle(direction, from, to),
  duration: formatDuration(duration / 1000),
  date: formatDate(created_at),
  notes: getCallNotes(notes)
});
