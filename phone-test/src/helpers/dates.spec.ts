import { formatDate, formatDuration, getValidDate } from './dates';

describe('formatDuration', () => {
  it('formats duration longer than an hour correctly', () => {
    expect(formatDuration(3600)).toBe('01:00:00');
    expect(formatDuration(3661)).toBe('01:01:01');
  });

  it('formats duration shorter than an hour correctly', () => {
    expect(formatDuration(59)).toBe('00:59');
    expect(formatDuration(600)).toBe('10:00');
  });
});

describe('getValidDate', () => {
  it('returns a valid Date object from a string', () => {
    const dateStr = '2022-11-16T13:37:05.822Z';
    const date = getValidDate(dateStr);
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe(dateStr);
  });

  it('returns the same Date object if a Date object is passed', () => {
    const dateObj = new Date();
    expect(getValidDate(dateObj)).toBe(dateObj);
  });

  it('returns a new Date object if the input is invalid', () => {
    const invalidDate = 'invalid date';
    const date = getValidDate(invalidDate);
    expect(date).toBeInstanceOf(Date);
    expect(isNaN(date.getTime())).toBe(true);
  });
});

describe('formatDate', () => {
  it('formats date string correctly with default variant', () => {
    const dateStr = '2022-11-16T13:37:05.822Z';
    const formattedDate = formatDate(dateStr, 'LLL d - HH:mm', 'UTC');
    const expectedDate = 'Nov 16 - 13:37';
    expect(formattedDate).toBe(expectedDate);
  });

  it('formats date string correctly with custom variant', () => {
    const dateStr = '2022-11-16T13:37:05.822Z';
    const formattedDate = formatDate(dateStr, 'yyyy-MM-dd', 'UTC');
    expect(formattedDate).toBe('2022-11-16');
  });

  it('handles invalid date string', () => {
    const invalidDateStr = 'invalid date';
    expect(() => formatDate(invalidDateStr)).toThrow(RangeError);
  });
});
