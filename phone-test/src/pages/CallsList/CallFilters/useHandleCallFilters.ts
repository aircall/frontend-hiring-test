import { useState } from 'react';
import { Filters } from './index.decl';

function filterCalls(calls: Call[], filters: Filters) {
  return calls.filter(call => matchDirection(call) && matchStatus(call) && matchType(call));

  function matchDirection(call: Call) {
    if (!filters.direction) {
      return true;
    }

    return call.direction === filters.direction;
  }

  function matchType(call: Call) {
    if (!filters.type) {
      return true;
    }

    return call.call_type === filters.type;
  }

  function matchStatus(call: Call) {
    if (!filters.status) {
      return true;
    }

    if (filters.status === 'archived' && call.is_archived) {
      return true;
    }

    if (filters.status === 'not-archived' && !call.is_archived) {
      return true;
    }

    return false;
  }
}

/**
 * Helper custom hook for handling CallFilters' filters
 */
export function useHandleCallFilters() {
  const [filters, setFilters] = useState<Filters>({});

  const hasActiveFilters = Object.values(filters).some(value => Boolean(value));

  return {
    filters,
    setFilters,
    hasActiveFilters,
    filterCalls
  };
}
