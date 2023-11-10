import { EMPTY_VALUE } from './constants';
import { CallFiltersProps, Filters } from './index.decl';

export function onFilterChangeHandler(
  filters: Filters,
  onChangeFilters: CallFiltersProps['onChangeFilters']
) {
  return function onFilterChange(filterType: keyof Filters, newValue?: string) {
    onChangeFilters({
      ...filters,
      [filterType]: newValue ?? EMPTY_VALUE
    });
  };
}
