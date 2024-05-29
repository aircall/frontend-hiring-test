export const CallTitle = ({ call_type }: { call_type: CallType }) => {
  const title =
    call_type === CallType.MISSED
      ? 'Missed call'
      : call_type === CallType.ANSWERED
      ? 'Call answered'
      : 'Voicemail';
  return <span>{title}</span>;
};
