import { Filters } from './index.decl';
import { EMPTY_VALUE } from './constants';

export const CALL_TYPE_OPTIONS: { label: string; value: Filters['type'] | typeof EMPTY_VALUE }[] = [
  {
    label: 'All',
    value: EMPTY_VALUE
  },
  {
    label: 'Missed',
    value: 'missed'
  },
  {
    label: 'Answered',
    value: 'answered'
  },
  {
    label: 'Voicemail',
    value: 'voicemail'
  }
];

export const CALL_DIRECTION_OPTIONS: {
  label: string;
  value: Filters['direction'] | typeof EMPTY_VALUE;
}[] = [
  {
    label: 'All',
    value: EMPTY_VALUE
  },
  {
    label: 'Inbound',
    value: 'inbound'
  },
  {
    label: 'Outbound',
    value: 'outbound'
  }
];

export const CALL_STATUS_OPTIONS: {
  label: string;
  value: Filters['status'] | typeof EMPTY_VALUE;
}[] = [
  {
    label: 'All',
    value: EMPTY_VALUE
  },
  {
    label: 'Not Archived',
    value: 'not-archived'
  },
  {
    label: 'Archived',
    value: 'archived'
  }
];

export function useBuildFilterOptions() {
  return {
    callTypeOptions: CALL_TYPE_OPTIONS,
    callDirectionOptions: CALL_DIRECTION_OPTIONS,
    callStatusOptions: CALL_STATUS_OPTIONS
  };
}
