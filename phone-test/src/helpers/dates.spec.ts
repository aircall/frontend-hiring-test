import { formatDate, formatDuration } from './dates';
import { register, unregister } from 'timezone-mock';

function parseMinutesToSeconds(minutes: number) {
  return minutes * 60;
}

/**
 * Using timezone-mock, we ensure consistency in the timezone
 * for our tests, regardless of the machine's timezone where
 * they are executed.
 */
beforeAll(() => {
  register('UTC');
});

afterAll(() => {
  unregister();
});

describe('formatDuration function', () => {
  it.each([
    {
      expected: '01:01:00',
      seconds: parseMinutesToSeconds(61)
    },
    {
      expected: '05:00',
      seconds: parseMinutesToSeconds(5)
    },
    {
      expected: '00:00',
      seconds: parseMinutesToSeconds(0)
    }
  ])('Returns "$expected" when it receives "$seconds" seconds', ({ expected, seconds }) => {
    const result = formatDuration(seconds);

    expect(result).toBe(expected);
  });
});

describe('formatDate function', () => {
  describe('Without customFormat', () => {
    it.each([
      {
        expected: 'Nov 16 - 13:37',
        date: '2022-11-16T13:37:05.822Z'
      },
      {
        expected: 'Jan 1 - 05:05',
        date: '2022-01-01T05:05:05.822Z'
      }
    ])('Returns "$expected" when it receives "$date"', ({ expected, date }) => {
      const result = formatDate(date);

      expect(result).toBe(expected);
    });
  });

  describe('With customFormat', () => {
    it.each([
      {
        expected: '23:59',
        date: '2023-12-31T23:59:05.822Z',
        customFormat: 'HH:mm'
      },
      {
        expected: '00:01',
        date: '2023-01-01T00:01:00.000Z',
        customFormat: 'HH:mm'
      },
      {
        expected: 'Dec 31',
        date: '2023-12-31T00:01:00.000Z',
        customFormat: 'LLL d'
      }
    ])(
      'Returns "$expected" when it receives "$date" and customFormat "$customFormat"',
      ({ expected, date, customFormat }) => {
        const result = formatDate(date, customFormat);

        expect(result).toBe(expected);
      }
    );
  });
});
