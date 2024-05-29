interface Call {
  id: string;
  call_type: CallType;
  created_at: string;
  direction: string;
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

enum CallType {
  MISSED = 'missed',
  ANSWERED = 'answered',
  VOICEMAIL = 'voicemail'
}
