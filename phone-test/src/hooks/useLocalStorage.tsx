import { useCallback, useMemo } from 'react';

export const useLocalStorage = (keyName: string, defaultValue: any) => {
  const value = window.localStorage.getItem(keyName);
  const storedValue = useMemo(() => {
    if (value) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  }, [keyName, defaultValue, value]);

  const setStoredValue = useCallback(
    (value: any) => {
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
