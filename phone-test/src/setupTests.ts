// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { formatDate, formatDuration, getday } from './helpers/dates';



describe("Format Date Test Cases", ()=> {
    it("should validate if the formatting is correct for duration > 3600", ()=>{
        const result = formatDuration(4000)
        expect(result.length).toStrictEqual(8)
    })

    it("Should validate if the formatting is correct for duration < 3600", ()=>{
        const result = formatDuration(2000)
        expect(result.length).toStrictEqual(5)
    })

    it("Should validate if the formatting is correct for duration = 0", ()=>{
        const result = formatDuration(0)
        expect(result).toStrictEqual("00:00")
    })
})

describe("Get Format Date Test Cases", ()=>{
    it("should validate if the date is formatted correctly to the desired format", ()=>{
        const result = formatDate("2023-09-26T01:07:11.267Z")
        expect(result).toStrictEqual('Sep 26 - 06:37')
    })
})

describe("Get Day Test Cases", ()=>{
    it("should validate if the correct day is extracted when date format is changed", ()=>{
        const result = getday("2023-09-26T01:07:11.267Z")
        expect(result).toStrictEqual('Sep 26')
    })
})
