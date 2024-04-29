import { format, parseISO, isValid } from 'date-fns';

import { formatDuration, getValidDate, formatDate } from './dates'; // Update the path accordingly
describe('dates helpers', () => {
  describe('formatDuration function', () => {
    it('should format duration greater than or equal to 3600 seconds correctly', () => {
      const duration = 3661;
      const expectedOutput = '01:01:01';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should format duration less than 3600 seconds correctly', () => {
      const duration = 300;
      const expectedOutput = '05:00';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should return "00:00" when duration is 0', () => {
      const duration = 0;
      const expectedOutput = '00:00';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should return "01:00" when duration is 60 seconds', () => {
      const duration = 60;
      const expectedOutput = '01:00';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should return "01:00:00" when duration is 3600 seconds', () => {
      const duration = 3600;
      const expectedOutput = '01:00:00';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should return "59:59" when duration is 3599 seconds', () => {
      const duration = 3599;
      const expectedOutput = '59:59';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });

    it('should return "23:59:59" when duration is 86399 seconds', () => {
      const duration = 86399;
      const expectedOutput = '23:59:59';
      expect(formatDuration(duration)).toEqual(expectedOutput);
    });
  });

  describe('getValidDate function', () => {
    it('should return a valid Date object when a valid date string is passed', () => {
      const validDateString = '2022-11-16T13:37:05.822Z';
      expect(getValidDate(validDateString)).toBeInstanceOf(Date);
      expect(isValid(getValidDate(validDateString))).toBe(true);
    });

    it('should return a valid Date object when a Date object is passed', () => {
      const validDateObject = new Date();
      expect(getValidDate(validDateObject)).toBeInstanceOf(Date);
      expect(isValid(getValidDate(validDateObject))).toBe(true);
    });

    it('should return a valid Date object when an invalid date string is passed', () => {
      const invalidDateString =
        'Mon Mar 09 2020 13:33:55 GMT+0100 (heure normale d’Europe centrale)';
      expect(getValidDate(invalidDateString)).toBeInstanceOf(Date);
      expect(isValid(getValidDate(invalidDateString))).toBe(true); // Even though it's considered invalid, it should still return a Date object
    });

    it('should return the same Date object when a valid Date object is passed', () => {
      const validDateObject = new Date();
      const date = getValidDate(validDateObject);
      expect(date).toBe(validDateObject);
      expect(isValid(date)).toBe(true);
    });

    it('should return the same Date object when a valid ISO string is passed', () => {
      const validISOString = '2022-11-16T13:37:05.822Z';
      const date = getValidDate(validISOString);
      expect(date.toISOString()).toEqual(validISOString);
      expect(isValid(date)).toBe(true);
    });
  });
  describe('formatDate function', () => {
    it('should format date correctly for a Date object', () => {
      const dateObject = new Date(2022, 10, 16, 13, 37, 5, 822);
      // Convert the Date object to ISO string before passing it to formatDate
      const isoString = dateObject.toISOString();
      expect(formatDate(isoString)).toEqual('Nov 16 - 13:37');
    });

    it('should format date correctly for a given ISO string', () => {
      const dateString = '2022-11-16T13:37:05.822Z';
      expect(formatDate(dateString)).toEqual('Nov 16 - 14:37');
    });
  });
});
