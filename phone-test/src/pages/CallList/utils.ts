import { formatDate } from '../../helpers/dates';

export const groupCallsByDate = (calls: Call[]) => {
  const sortedCalls = calls.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return sortedCalls.reduce((acc, call) => {
    const date = formatDate(call.created_at, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date] = [...acc[date], call];
    return acc;
  }, {} as Record<string, Call[]>);
};
