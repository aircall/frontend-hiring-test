export interface CallDetailProps {
    call: {
      id: string;
      direction: 'inbound' | 'outbound';
      call_type: 'missed' | 'answered' | 'voicemail';
      from: string;
      to: string;
      duration: number;
      created_at: string;
      notes?: string[];
    };
    onClick: (id: string) => void;
  }