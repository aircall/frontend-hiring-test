import { formatDate, formatDuration } from './dates';

describe('dates helpers', () => {

    test('Converts a date, as a string, into another date in a more readable format', () => {

        const inputDate = "2023-01-04T20:40:54.258Z";

        const outputDate = formatDate(inputDate);
        expect(outputDate).toBe("Jan 4 - 17:40");
    });

    test('Format Duration Call', () => {

        const inputDuration = 55583;

        const outputDuration = formatDuration(inputDuration);
        expect(outputDuration).toBe("15:26:23");
    });

});
