import { formatDate, formatDuration, truncDate } from './dates';

describe('truncDate', () => {
  describe('string input', () => {
    it('should throw an error if the input is not a valid date', () => {
      expect(() => truncDate('dummy string')).toThrowErrorMatchingInlineSnapshot(
        `"Invalid time value"`
      );
    });

    it('should return the date truncated', () => {
      const date = new Date(2024, 11, 31, 15, 23, 12).toISOString();
      expect(truncDate(date)).toBe('31-12-2024');
    });
  });

  describe('date input', () => {
    it('should return the date truncated', () => {
      const date = new Date(2024, 11, 31, 15, 23, 12);
      expect(truncDate(date)).toBe('31-12-2024');
    });
  });
});

describe('formatDate', () => {
  it('should throw an error if the input is not a valid date', () => {
    expect(() => formatDate('dummy string')).toThrowErrorMatchingInlineSnapshot(
      `"Invalid time value"`
    );
  });

  it('should return the date formatted', () => {
    const date = new Date(2024, 11, 31, 15, 23, 12).toISOString();
    expect(formatDate(date)).toBe('Dec 31 - 15:23');
  });
});

describe('formatDuration', () => {
  it.each([
    [-1, '59:59'],
    [0, '00:00'],
    [1, '00:01'],
    [3599, '59:59'],
    [3600, '01:00:00'],
    [3601, '01:00:01']
  ])('should handle %d', (value, expected) => {
    expect(formatDuration(value)).toBe(expected);
  });
});
