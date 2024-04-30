export const typeFilterOptions = [
  { label: 'Answered', value: 'answered' },
  { label: 'Missed', value: 'missed' },
  { label: 'Voicemail', value: 'voicemail' }
];

export const directionFilterOptions = [
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' }
];

export const pageSizeOptions = [
  { value: 5, label: '5' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
];

export const CALLS_PER_PAGE = 5;

interface GroupedCalls {
  [date: string]: Call[]; // Assuming Call is the type of your call objects
}

function groupCallsByDate(calls: Call[]) {
  const groupedCalls: GroupedCalls = {};
  calls.forEach(call => {
    const date = call.created_at.split('T')[0]; // Assuming created_at is a string in ISO format
    if (!groupedCalls[date]) {
      groupedCalls[date] = [];
    }
    groupedCalls[date].push(call);
  });

  // Sort the keys (dates) in descending order
  const sortedDates = Object.keys(groupedCalls).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Create a new object with sorted keys
  interface SortedGroupedCalls {
    [date: string]: Call[]; // Assuming Call is the type of your call objects
  }
  const sortedGroupedCalls: SortedGroupedCalls = {};
  sortedDates.forEach(date => {
    sortedGroupedCalls[date] = groupedCalls[date];
  });

  return sortedGroupedCalls;
}

export function groupCallsIntoPages(calls: Call[], pageSize: number) {
  const pages = [];
  for (let i = 0; i < calls.length; i += pageSize) {
    const page = calls.slice(i, i + pageSize);
    const groupedPage = groupCallsByDate(page);
    pages.push(groupedPage);
  }
  return pages;
}
