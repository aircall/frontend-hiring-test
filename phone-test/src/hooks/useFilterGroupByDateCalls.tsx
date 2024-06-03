import { useMemo } from 'react';
import { Call } from '../components/Call';

interface GroupedCallsByDateProps {
  [date: string]: Call[];
}

export const useFilterGroupByDateCalls = (filterValue: string, calls: Call[]) => {
  const filteredCalls = useMemo<Call[]>(() => {
    if (filterValue === '') return calls || [];
    return calls.filter((call: Call) => {
      if (filterValue === '') return true;
      if (filterValue === 'inbound' || filterValue === 'outbound') {
        return call.direction === filterValue;
      }
      return call.call_type === filterValue;
    });
  }, [filterValue, calls]);

  const groupedCallsByDate: GroupedCallsByDateProps = useMemo(
    () =>
      filteredCalls.reduce((acc: GroupedCallsByDateProps, call: Call) => {
        const date = new Date(call.created_at).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(call);
        return acc;
      }, {}),
    [filteredCalls]
  );

  return groupedCallsByDate;
};
