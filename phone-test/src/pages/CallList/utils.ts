import { formatDate } from '../../helpers/dates';

export const groupCallsByDate = (calls: Call[]) => {
  return calls.reduce((acc, call) => {
    const date = formatDate(call.created_at, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date] = [...acc[date], call];
    return acc;
  }, {} as Record<string, Call[]>);
};
