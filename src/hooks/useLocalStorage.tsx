import { useCallback, useMemo } from 'react';

export const useLocalStorage = <T,>(keyName: string, defaultValue: T) => {
  const storedValue = useMemo<T>(() => {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  }, [keyName, defaultValue]);

  const setStoredValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (value) {
        window.localStorage.setItem(keyName, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(keyName);
      }
    },
    [keyName]
  );

  return [storedValue, setStoredValue] as const;
};
