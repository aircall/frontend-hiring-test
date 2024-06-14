import { formatDuration, formatDate, getValidDate } from './dates';
import { format } from 'date-fns';

describe('dates helpers', () => {
  describe('formatDuration', () => {
    test('formats duration less than an hour correctly', () => {
      expect(formatDuration(600)).toBe('10:00');
      expect(formatDuration(59)).toBe('00:59');
    });

    test('formats duration of an hour or more correctly', () => {
      expect(formatDuration(3600)).toBe('01:00:00');
      expect(formatDuration(3661)).toBe('01:01:01');
    });
  });

  describe('getValidDate', () => {
    const { isValid, parseISO } = require('date-fns');

    test('returns a valid Date object for a valid ISO string', () => {
      const validISOString = '2022-11-16T13:37:05.822Z';
      expect(isValid(parseISO(validISOString))).toBe(true);
      expect(getValidDate(validISOString).toISOString()).toBe(validISOString);
    });

    test('returns a valid Date object for a Date instance', () => {
      const date = new Date();
      expect(getValidDate(date)).toBeInstanceOf(Date);
      expect(getValidDate(date).toISOString()).toBe(date.toISOString());
    });

    test('returns a valid Date object for an invalid ISO string using Date API', () => {
      const invalidISOString =
        'Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)';
      const parsedDate = getValidDate(invalidISOString);
      expect(parsedDate).toBeInstanceOf(Date);
      expect(isValid(parsedDate)).toBe(true);
    });
  });

  describe('formatDate', () => {
    test('formats date string into a human readable format', () => {
      const dateString = '2024-06-12T12:53:56.542Z';

      // Get the local time equivalent of the date string
      const localDate = new Date(dateString);
      const expectedFormattedDate = format(localDate, 'LLL d - HH:mm');

      expect(formatDate(dateString)).toBe(expectedFormattedDate);
    });

    test('formats invalid date string into a human readable format using Date API', () => {
      const invalidDateString =
        'Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)';
      const expectedDate = new Date(invalidDateString);
      const formattedExpectedDate = format(expectedDate, 'LLL d - HH:mm');
      expect(formatDate(invalidDateString)).toBe(formattedExpectedDate);
    });
  });
});
