export function getStorageItem<T>(key: string, storage?: Storage): [T | null, string | null];
export function getStorageItem<T>(
  key: string,
  defaultValue: T | null,
  storage?: Storage
): [T | null, string | null];
export function getStorageItem<T>(
  key: string,
  defaultValue?: T | null,
  storage?: Storage
): [T | null, string | null] {
  const value = (storage ?? window.localStorage).getItem(key) as string | null;

  if (!value) {
    return [defaultValue ?? null, null];
  }

  try {
    return [JSON.parse(value) as T, value];
  } catch {
    return [defaultValue ?? null, value];
  }
}

export function setStorageItem(key: string, value: any, storage?: Storage) {
  (storage ?? window.localStorage).setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string, storage?: Storage) {
  (storage ?? window.localStorage).removeItem(key);
}
