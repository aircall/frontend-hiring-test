import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

interface UseQueryParamsResult {
  getQueryParam: (name: string) => string | null;
  setQueryParam: (name: string, value: string) => void;
  setQueryParams: (params: Record<string, string>) => void;
  resetQueryParams: (params: Record<string, string>) => void;
}

export const useQueryParams = (): UseQueryParamsResult => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = useCallback(
    (params: URLSearchParams, updates: Record<string, string>) => {
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      return params;
    },
    []
  );

  const getQueryParam = useCallback(
    (name: string) => {
      return searchParams.get(name) ?? null;
    },
    [searchParams]
  );

  const setQueryParam = useCallback(
    (name: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(name, value);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  const setQueryParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = updateSearchParams(new URLSearchParams(searchParams), params);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams, updateSearchParams]
  );

  const resetQueryParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = updateSearchParams(new URLSearchParams(), params);
      setSearchParams(newSearchParams);
    },
    [setSearchParams, updateSearchParams]
  );

  return {
    getQueryParam,
    setQueryParam,
    setQueryParams,
    resetQueryParams
  };
};
