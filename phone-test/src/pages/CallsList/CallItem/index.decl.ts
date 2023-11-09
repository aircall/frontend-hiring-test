export interface CallItemProps {
  call: Call;
  onOpenDetail: (callId: Call['id']) => void;
  onArchive: (callId: Call['id']) => void;
}
