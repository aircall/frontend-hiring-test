import { useCallback, useMemo } from 'react';

export const useLocalStorage = (keyName: string, defaultValue: string | undefined) => {
  const storedValue = useMemo(() => {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  }, [keyName, defaultValue]);

  const setStoredValue = useCallback(
    (value: string) => {
      if (value) {
        window.localStorage.setItem(keyName, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(keyName);
      }
    },
    [keyName]
  );

  return [storedValue, setStoredValue];
};
