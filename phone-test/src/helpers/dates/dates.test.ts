import { formatDate, formatDuration } from './dates';

describe('helpers/dates', () => {
  describe('formatDuration', () => {
    it('should format duration when duration is greater than or equal to 3600', () => {
      const duration = 3600;
      const result = formatDuration(duration);
      expect(result).toBe('01:00:00');
    });

    it('should format duration when duration is less than 3600', () => {
      const duration = 600;
      const result = formatDuration(duration);
      expect(result).toBe('10:00');
    });
  });

  describe('formatDate', () => {
    it('should format a date with time by default', () => {
      const date = '2023-10-16T13:37:05.822Z';
      const result = formatDate(date);
      expect(result).toBe('Oct 16 - 13:37');
    });

    it('should format a date without time when withoutTime option is true', () => {
      const date = '2023-10-16T13:37:05.822Z';
      const result = formatDate(date, { withoutTime: true });
      expect(result).toBe('Oct 16');
    });
  });
});
