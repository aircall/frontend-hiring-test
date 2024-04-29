// @ts-nocheck
export const typeFilterOptions = [
  // { label: 'All', value: '' },
  { label: 'Answered', value: 'answered' },
  { label: 'Missed', value: 'missed' },
  { label: 'Voicemail', value: 'voicemail' }
];

export const directionFilterOptions = [
  { label: 'All', value: '' },
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

export function groupCallsByDate(calls) {
  const groupedCalls = {};
  calls.forEach(call => {
    const date = call.created_at.split('T')[0]; // Assuming created_at is a string in ISO format
    if (!groupedCalls[date]) {
      groupedCalls[date] = [];
    }
    groupedCalls[date].push(call);
  });

  // Sort the keys (dates) in descending order
  const sortedDates = Object.keys(groupedCalls).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  // Create a new object with sorted keys
  const sortedGroupedCalls = {};
  sortedDates.forEach(date => {
    sortedGroupedCalls[date] = groupedCalls[date];
  });

  return sortedGroupedCalls;
}

export function groupCallsIntoPages(calls, pageSize) {
  const pages = [];
  for (let i = 0; i < calls.length; i += pageSize) {
    const page = calls.slice(i, i + pageSize);
    const groupedPage = groupCallsByDate(page);
    pages.push(groupedPage);
  }
  return pages;
}
