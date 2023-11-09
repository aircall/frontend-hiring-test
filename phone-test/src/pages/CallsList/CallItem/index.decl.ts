export interface CallItemProps {
  call: Call;
  onClick: (callId: Call['id']) => void;
}
