export function groupBy<T, R extends string | number | symbol>(
  input: T[],
  groupByMapper: (value: T) => R
): Record<R, T[]> {
  return input.reduce((prev, current) => {
    const keyValue = groupByMapper(current);

    if (Object.prototype.hasOwnProperty.call(prev, keyValue)) {
      prev[keyValue].push(current);
    } else {
      prev[keyValue] = [current];
    }

    return prev;
  }, {} as Record<R, T[]>);
}
