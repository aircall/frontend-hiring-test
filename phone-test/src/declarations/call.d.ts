type DirectionType = 'inbound' | 'outbound';
type CallType = 'answered' | 'missed' | 'voicemail';

interface Call {
  id: string;
  created_at: string;
  direction: DirectionType;
  call_type: CallType;
  from: string;
  duration: number;
  is_archived: boolean;
  notes?: string[] | undefined;
  to: string;
  via: string;
}

interface Note {
  id: string;
  content: string;
}
