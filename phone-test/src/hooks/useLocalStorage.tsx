import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { getStorageItem, removeStorageItem, setStorageItem } from '../helpers/storage';

export function useLocalStorage<T>(
  keyName: string,
  defaultValue: T | null
): [T | null, (value: T | null) => void] {
  const valueRef = useRef<string | null>(null);
  const parsedValueRef = useRef<T | null>(null);

  useEffect(() => {
    valueRef.current = null;
    parsedValueRef.current = null;
  }, [keyName, defaultValue]);

  const subscribe = useCallback((onChange: () => void): (() => void) => {
    const handler = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === 'keyName') {
        onChange();
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setStoredValue = useCallback(
    (value: T | null) => {
      if (value) {
        setStorageItem(keyName, value);
      } else {
        removeStorageItem(keyName);
      }
    },
    [keyName]
  );

  const getSnapshot = () => {
    const [parsedValue, value] = getStorageItem<T | null>(keyName);

    if (value) {
      if (value !== valueRef.current) {
        valueRef.current = value;
        parsedValueRef.current = parsedValue;
      }
      return parsedValueRef.current;
    } else {
      return defaultValue;
    }
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return [value, setStoredValue];
}
