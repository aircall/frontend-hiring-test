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

const getValidDate = (date: Date | string) => {
  const potentialValidDate = typeof date === 'string' ? parseISO(date) : date;

  // Make sure that the date is a valid ISO otherwise fallback to Date API
  // The following date string "Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)"
  // is considered as invalid because it's a string reprensentation of the Date in spite of the fact that
  // it's valid when using the Date API.
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
