interface Call {
  id: string;
  call_type: string;
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
