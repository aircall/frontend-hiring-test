import { formatDate, formatDuration } from '../dates';

describe('dates helpers', () => {
  test.each([
    [0, '00:00'],
    [600, '10:00'],
    [36610, '10:10:10']
  ])('Format call duration (success) - With value %s', (duration, expectedDuration) => {
    expect(formatDuration(duration)).toEqual(expectedDuration);
  });

  /**
   * I would expect values 'null' and '[]' to fail but they don't.
   * I would consider this a bug on the function.
   * */
  test.each(['abc', undefined, {}])('Format call duration (failure) - With value: %s', duration => {
    // @ts-expect-error
    expect(() => formatDuration(duration)).toThrowError(/invalid time/i);
  });

  const successfulSampleData = [
    ['2022-11-16T13:37:05.822Z', 'Nov 16 - 13:37'],
    ['2022-11-16', 'Nov 16 - 00:00'],
    [new Date('January 10, 2002 01:02:03'), 'Jan 10 - 01:02'],
    [1234567890, 'Jan 15 - 06:56']
  ];
  test.each(successfulSampleData)(
    'Get a valid formatted date (success) - With value: %s',
    // @ts-expect-error
    (date, expectedDate) => {
      // @ts-expect-error
      expect(() => formatDate(date)).not.toThrowError();
      // @ts-expect-error
      expect(formatDate(date)).toEqual(expectedDate);
    }
  );

  /**
   * Null does not fail and returns a valid 'Jan 1 - 01:00'
   * but in my opinion, I would have expected it to fail instead
   * */
  const failSampleData = ['T13:37:05.822Z', 'abc', undefined];
  test.each(failSampleData)('Get a valid formatted date (failure) - With value: %s', date => {
    // @ts-expect-error
    expect(() => formatDate(date)).toThrowError();
  });
});
