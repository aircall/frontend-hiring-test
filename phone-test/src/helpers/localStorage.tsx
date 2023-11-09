export function getLocalStorageItem<T>(keyName: string): T | void {
  const value = window.localStorage.getItem(keyName);

  if (value) {
    return JSON.parse(value);
  }
}

/**
 * @param keyName the key of the localStorage item
 * @param value the value to be set on the localStorage item.
 * If it's null or undefined, the localStorage item will be removed
 */
export function addOrRemoveLocalStorageItem(keyName: string, value?: unknown) {
  if (value == null) {
    window.localStorage.removeItem(keyName);

    return;
  }

  window.localStorage.setItem(keyName, JSON.stringify(value));
}
