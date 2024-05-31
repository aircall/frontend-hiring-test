import { format, parseISO } from 'date-fns';
import { formatDate, formatDuration,  } from './dates';

describe('dates helpers', () => {
  describe('formatDuration', () => {
    it('should format duration greater than or equal to 3600 seconds to "hh:mm:ss"', () => {
      expect(formatDuration(3600)).toBe('01:00:00');
      expect(formatDuration(3661)).toBe('01:01:01');
    });

    it('should format duration less than 3600 seconds to "mm:ss"', () => {
      expect(formatDuration(59)).toBe('00:59');
      expect(formatDuration(600)).toBe('10:00');
      expect(formatDuration(3599)).toBe('59:59');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('00:00');
    });

    it('should handle negative duration', () => {
      expect(formatDuration(-600)).toBe('00:00');
    });
  });

  describe('formatDate', () => {
    it('should format a valid ISO date string to "MMM d - HH:mm"', () => {
      const date = '2022-11-16T13:37:05.822Z';
      const expectedFormattedDate = format(parseISO(date), 'LLL d - HH:mm');
      expect(formatDate(date)).toBe(expectedFormattedDate);
    });

    it('should handle invalid date string and fall back to Date API', () => {
      const date = 'Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)';
      const fallbackDate = new Date(date);
      const expectedFormattedDate = format(fallbackDate, 'LLL d - HH:mm');
      expect(formatDate(date)).toBe(expectedFormattedDate);
    });

    it('should format a Date object to "MMM d - HH:mm"', () => {
      const date = new Date(2022, 10, 16, 13, 37, 5);
      const expectedFormattedDate = format(date, 'LLL d - HH:mm');
      expect(formatDate(date.toISOString())).toBe(expectedFormattedDate);
    });

    it('should handle empty date string and return Invalid Date', () => {
      const date = '';
      expect(() => formatDate(date)).toThrowError();
    });
  });
});
