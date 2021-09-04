import { CALL_TYPE } from '@core/models/call-type.enum';

export const callTypes: { title: CALL_TYPE; icon: string }[] = [
  {
    title: CALL_TYPE.answered,
    icon: 'local_phone',
  },
  {
    title: CALL_TYPE.missed,
    icon: 'phone_missed',
  },
  {
    title: CALL_TYPE.voicemail,
    icon: 'voicemail',
  },
];
