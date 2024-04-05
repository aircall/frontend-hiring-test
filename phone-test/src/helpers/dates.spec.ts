import { format } from 'date-fns';
import { formatDate, formatDuration } from './dates';

describe('dates helpers', () => {
    
    describe('formatDate', () => {
        it('should format a date correctly using default format -> LLL d - HH:mm', () => {
            const dummyDate = new Date();

            const dateToCompare = format(dummyDate, 'LLL d - HH:mm');
            const formattedDate = formatDate(dummyDate.toString());

            expect(formattedDate).toBe(dateToCompare);
        });

        it('should format a date correctly using another format -> LLL', () => {
            const dummyDate = new Date();
            const dateToCompare = format(dummyDate, 'LLL');
            
            const formattedDate = formatDate(dummyDate.toString(), 'LLL');
            
            expect(formattedDate).toBe(dateToCompare);
        });

        it('should throw a range error if date format is not correct', () => {
            const dummyDate = new Date();
            const extraneousFormat = "ZZZZ ZZZZ ZZZZ"

            expect(() => formatDate(dummyDate.toString(), extraneousFormat)).toThrow(RangeError);
        });

        it('should throw a range error if date string is invalid', () => {
            const wrongDate = "__WRONG_DATE__";

            expect(() => formatDate(wrongDate)).toThrow(RangeError);
        });

        it('should throw a range error if date string is invalid - forcing arguments', () => {
            const wrongDateDataType = { foo: 'bar'};

            expect(() => formatDate(wrongDateDataType as unknown as string)).toThrow(RangeError);
        });
    });

    describe('formatDuration', () => {
        it('should set duration correctly given 3600 seconds', () => {
            const expectedFormat = '01:00:00';
            const formattedDuration = formatDuration(3600);

            expect(formattedDuration).toBe(expectedFormat);
        });

        it('should check if format calculation is correct given 3700 seconds', () => {
            const notToBeExpectedFormat = '01:00:00';
            const formattedDuration = formatDuration(3700);

            expect(formattedDuration).not.toBe(notToBeExpectedFormat);
        });

        it('should set duration correctly given 60 seconds', () => {
            const expectedFormat = '00:01:00';
            const formattedDuration = formatDuration(60);

            expect(formattedDuration).not.toBe(expectedFormat);
        });

        it('should check if format calculation is correct given 120 seconds', () => {
            const notToBeExpectedFormat = '00:01:00';
            const formattedDuration = formatDuration(60);

            expect(formattedDuration).not.toBe(notToBeExpectedFormat);
        });

        it('should fail if argument is not a valid number despite JS string-number typing interoperability', () => {
            expect(() => formatDuration('120' as unknown as number)).toThrow(RangeError);
        });
    })
});
