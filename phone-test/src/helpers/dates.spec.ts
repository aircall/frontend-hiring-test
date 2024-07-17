import { formatDuration, formatDate, formatDateAsDay } from './dates';
import { format, parseISO } from 'date-fns';

const HELPER_FORMATS = {
  DAY_WITH_TIME: 'LLL d - HH:mm',
  DAY_WITH_YEAR: 'LLL d - yyyy'
};

const formatTestDate = ({
  date,
  dateFormat,
  isISO
}: {
  date: string;
  dateFormat: string;
  isISO: boolean;
}) => format(isISO ? parseISO(date) : new Date(date), dateFormat);

describe('dates helpers', () => {
  describe('formatDuration', () => {
    it('formats duration of more than an hour correctly', () => {
      const duration = 3661; // 1 hour, 1 minute, and 1 second
      const result = formatDuration(duration);
      expect(result).toBe('01:01:01');
    });

    it('formats duration of less than an hour correctly', () => {
      const duration = 601; // 10 minutes and 1 second
      const result = formatDuration(duration);
      expect(result).toBe('10:01');
    });
  });

  describe('formatDate', () => {
    it('formats a valid ISO date string correctly', () => {
      const date = '2022-11-16T13:37:05.822Z';
      const result = formatDate(date);
      const expectedResult = formatTestDate({
        date,
        dateFormat: HELPER_FORMATS.DAY_WITH_TIME,
        isISO: true
      });
      expect(result).toBe(expectedResult);
    });

    it('formats a non-ISO date string correctly', () => {
      const date = 'Mon Mar 09 2020 13:33:55 GMT+0100';
      const result = formatDate(date);
      const expectedResult = formatTestDate({
        date,
        dateFormat: HELPER_FORMATS.DAY_WITH_TIME,
        isISO: false
      });
      expect(result).toBe(expectedResult);
    });
  });

  describe('formatDateAsDay', () => {
    it('formats a valid ISO date string correctly', () => {
      const date = '2022-11-16T13:37:05.822Z';
      const result = formatDateAsDay(date);
      const expectedResult = formatTestDate({
        date,
        dateFormat: HELPER_FORMATS.DAY_WITH_YEAR,
        isISO: true
      });
      expect(result).toBe(expectedResult);
    });

    it('formats a non-ISO date string correctly', () => {
      const date = 'Mon Mar 09 2020 13:33:55 GMT+0100';
      const result = formatDateAsDay(date);
      const expectedResult = formatTestDate({
        date,
        dateFormat: HELPER_FORMATS.DAY_WITH_YEAR,
        isISO: false
      });
      expect(result).toBe(expectedResult);
    });
  });
});
