import { formatDate, formatDuration } from './dates';

describe('formatDuration', () => {
  it('should format duration in hh:mm:ss when duration is greater than or equal to 3600 seconds', () => {
    expect(formatDuration(3600)).toEqual('01:00:00');
    expect(formatDuration(7200)).toEqual('02:00:00');
    expect(formatDuration(3661)).toEqual('01:01:01');
  });

  it('should format duration in mm:ss when duration is less than 3600 seconds', () => {
    expect(formatDuration(-10)).toEqual('59:50');
    expect(formatDuration(59)).toEqual('00:59');
    expect(formatDuration(600)).toEqual('10:00');
    expect(formatDuration(3599)).toEqual('59:59');
  });
});

describe('formatDate', () => {
  it('should return a formatted date when given a valid ISO string', () => {
    const date = '2022-11-16T13:37:05.822Z';
    const result = formatDate(date);
    expect(result).toEqual('Nov 16 - 14:37');
  });

  it('should return a formatted date when given a string representation of a valid Date object', () => {
    const date = 'Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)';
    const result = formatDate(date);
    expect(result).toEqual('Mar 9 - 13:33');
  });

});
