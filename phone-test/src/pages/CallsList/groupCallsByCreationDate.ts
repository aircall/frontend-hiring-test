import { CallGroup } from './index.decl';
import { formatDate } from '../../helpers/dates';

export function groupCallsByCreationDate(calls: Call[]) {
  return calls.reduce<CallGroup>((groupedCalls, call) => {
    const dayDate = formatDate(call.created_at, 'yyyy-MM-dd');

    if (!groupedCalls[dayDate]) {
      groupedCalls[dayDate] = [];
    }

    groupedCalls[dayDate] = [...groupedCalls[dayDate], call];

    return {
      ...groupedCalls
    };
  }, {});
}
