export interface Filters {
  type?: 'answered' | 'missed' | 'voicemail';
  direction?: 'inbound' | 'outbound';
  status?: 'not-archived' | 'archived';
}

export interface CallFiltersProps {
  filters: Filters;
  onChangeFilters: (newFilters: Filters) => void;
}
