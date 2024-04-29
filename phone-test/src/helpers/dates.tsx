import { format, isValid, parseISO } from 'date-fns';

export const formatDuration = (duration: number) => {
  if (duration >= 3600) {
    // 600 seconds 👉️ "00:10:00" (hh:mm:ss)
    return new Date(duration * 1000).toISOString().slice(11, 19);
  } else {
    // 600 seconds 👉️ "10:00" (mm:ss)
    return new Date(duration * 1000).toISOString().slice(14, 19);
  }
};

/**
 * Function: getValidDate
 * Description: Converts a Date object or string representation of a date to a valid Date object.
 *              If the provided date is already valid, returns it; otherwise, attempts to parse
 *              the string representation using ISO parsing. If ISO parsing fails, falls back
 *              to the Date API.
 * Parameters:
 *   - date: Date | string - The date to validate or parse.
 * Returns:
 *   - Date - A valid Date object.
 */
export const getValidDate = (date: Date | string) => {
  const potentialValidDate = typeof date === 'string' ? parseISO(date) : date;
  if (isValid(potentialValidDate)) {
    return potentialValidDate;
  }

  return new Date(date);
};

/**
 * Converts a date, as a string, into another date in a more readable format.
 * @param date ex: 2022-11-16T13:37:05.822Z
 * @returns human readable date
 */
export const formatDate = (date: string) => {
  return format(getValidDate(date), 'LLL d - HH:mm');
};
