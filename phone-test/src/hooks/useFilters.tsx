import { useCallback, useState, useEffect } from 'react';
import { useQueryParams } from './useQueryParams';

interface UseFiltersParams {
  defaultValues: Record<string, any>;
}

interface UseFiltersResult {
  filters: Record<string, string>;
  onFilterChange: (name: string, value: string) => void;
  filter: (data: any[]) => any[];
  resetFilters: () => void;
}

export const useFilters = ({ defaultValues }: UseFiltersParams): UseFiltersResult => {
  const { getQueryParam, setQueryParam, setQueryParams } = useQueryParams();
  const [filters, setFilters] = useState(defaultValues);

  useEffect(() => {
    const newFilters = { ...defaultValues };
    Object.keys(defaultValues).forEach(key => {
      const queryValue = getQueryParam(key);
      if (queryValue !== null) {
        newFilters[key] = queryValue;
      }
    });
    setFilters(newFilters);
  }, [getQueryParam, defaultValues]);

  const onFilterChange = useCallback(
    (name: string, value: string) => {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }));
      setQueryParam(name, value);
    },
    [setQueryParam]
  );

  const filter = useCallback(
    (data: any[]) => {
      return data.filter(item =>
        Object.keys(filters).every(key => filters[key] === '' || item[key] === filters[key])
      );
    },
    [filters]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultValues);
    setQueryParams(defaultValues);
  }, [defaultValues, setQueryParams]);

  return {
    filters,
    onFilterChange,
    filter,
    resetFilters
  };
};
