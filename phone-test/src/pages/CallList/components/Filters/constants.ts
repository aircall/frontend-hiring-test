import { CallType, Direction } from '../../../../declarations/enums';

export const callDirectionOptions: {
  label: string;
  value: any;
}[] = [
  {
    label: 'All',
    value: ''
  },
  {
    label: 'Inbound',
    value: Direction.Inbound
  },
  {
    label: 'Outbound',
    value: Direction.Outbound
  }
];

export const callTypeOptions: { label: string; value: string }[] = [
  {
    label: 'All',
    value: ''
  },
  {
    label: 'Missed',
    value: CallType.Missed
  },
  {
    label: 'Answered',
    value: CallType.Answered
  },
  {
    label: 'Voicemail',
    value: CallType.Voicemail
  }
];
