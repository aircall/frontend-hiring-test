interface Call {
  id: string;
  call_type: 'missed' | 'answered' | 'voicemail';
  created_at: string;
  direction: 'inbound' | 'outbound';
  from: string;
  duration: number;
  is_archived: boolean;
  notes: Note[];
  to: string;
  via: string;
}

interface Note {
  id: string;
  content: string;
}
