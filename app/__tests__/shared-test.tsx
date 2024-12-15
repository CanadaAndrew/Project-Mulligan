import { getValidDateDayBack, getValidDateByWeeks, getValidDateByMonths,
    getFutureDateByDay, getFutureDateByWeeks, getFutureDateByMonths,
    getLastDateOfMonth } from '.././shared';

//getValidDateDayBack
test('check for valid date days back', () => {
    const inputDate = '2024-12-10';
    const daysBack = 1;
    const expectedDate = '2024-12-09';
    const result = getValidDateDayBack(inputDate, daysBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date days back', () => {
    const inputDate = '2024-12-01';
    const daysBack = 1;
    const expectedDate = '2024-11-30';
    const result = getValidDateDayBack(inputDate, daysBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date days back', () => {
    const inputDate = '2024-01-01';
    const daysBack = 1;
    const expectedDate = '2023-12-31';
    const result = getValidDateDayBack(inputDate, daysBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date days back', () => {
    const inputDate = '2024-12-20';
    const daysBack = 10;
    const expectedDate = '2024-12-10';
    const result = getValidDateDayBack(inputDate, daysBack);
    expect(result).toBe(expectedDate);
});

//getFutureDateByDay
test('check for valid date days forward', () => {
    const inputDate = '2024-12-10';
    const daysForward = 1;
    const expectedDate = '2024-12-11';
    const result = getFutureDateByDay(inputDate, daysForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date days forward', () => {
    const inputDate = '2024-11-30';
    const daysForward = 1;
    const expectedDate = '2024-12-01';
    const result = getFutureDateByDay(inputDate, daysForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date days forward', () => {
    const inputDate = '2024-12-31';
    const daysForward = 1;
    const expectedDate = '2025-01-01';
    const result = getFutureDateByDay(inputDate, daysForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date days forward', () => {
    const inputDate = '2024-12-10';
    const daysForward = 10;
    const expectedDate = '2024-12-20';
    const result = getFutureDateByDay(inputDate, daysForward);
    expect(result).toBe(expectedDate);
});

//getValidDateByWeeks
test('check for valid date weeks backward', () => {
    const inputDate = '2024-12-10';
    const weeksBack = 1;
    const expectedDate = '2024-12-03';
    const result = getValidDateByWeeks(inputDate, weeksBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date weeks backward', () => {
    const inputDate = '2024-12-10';
    const weeksBack = 2;
    const expectedDate = '2024-11-26';
    const result = getValidDateByWeeks(inputDate, weeksBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date weeks backward', () => {
    const inputDate = '2024-01-01';
    const weeksBack = 1;
    const expectedDate = '2023-12-25';
    const result = getValidDateByWeeks(inputDate, weeksBack);
    expect(result).toBe(expectedDate);
});

//getFutureDateByWeeks
test('check for valid date weeks forward', () => {
    const inputDate = '2024-12-10';
    const weeksForward = 1;
    const expectedDate = '2024-12-17';
    const result = getFutureDateByWeeks(inputDate, weeksForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date weeks forward', () => {
    const inputDate = '2024-12-10';
    const weeksForward = 2;
    const expectedDate = '2024-12-24';
    const result = getFutureDateByWeeks(inputDate, weeksForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date weeks forward', () => {
    const inputDate = '2024-12-31';
    const weeksForward = 1;
    const expectedDate = '2025-01-07';
    const result = getFutureDateByWeeks(inputDate, weeksForward);
    expect(result).toBe(expectedDate);
});

//getValidDateByMonths
test('check for valid date months back', () => {
    const inputDate = '2024-12-14';
    const monthsBack = 1;
    const expectedDate = '2024-11-14';
    const result = getValidDateByMonths(inputDate, monthsBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date months back', () => {
    const inputDate = '2024-12-14';
    const monthsBack = 2;
    const expectedDate = '2024-10-14';
    const result = getValidDateByMonths(inputDate, monthsBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date months back', () => {
    const inputDate = '2025-01-01';
    const monthsBack = 1;
    const expectedDate = '2024-12-01';
    const result = getValidDateByMonths(inputDate, monthsBack);
    expect(result).toBe(expectedDate);
});

test('check for valid date months back', () => {
    const inputDate = '2024-12-31';
    const monthsBack = 1;
    const expectedDate = '2024-11-30';
    const result = getValidDateByMonths(inputDate, monthsBack);
    expect(result).toBe(expectedDate);
});

//getFutureDateByMonths
test('check for valid date months forward', () => {
    const inputDate = '2024-10-30';
    const monthsForward = 1;
    const expectedDate = '2024-11-30';
    const result = getFutureDateByMonths(inputDate, monthsForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date months forward', () => {
    const inputDate = '2024-10-30';
    const monthsForward = 2;
    const expectedDate = '2024-12-30';
    const result = getFutureDateByMonths(inputDate, monthsForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date months forward', () => {
    const inputDate = '2024-12-30';
    const monthsForward = 1;
    const expectedDate = '2025-01-30';
    const result = getFutureDateByMonths(inputDate, monthsForward);
    expect(result).toBe(expectedDate);
});

test('check for valid date months forward', () => {
    const inputDate = '2024-10-31';
    const monthsForward = 1;
    const expectedDate = '2024-11-30';
    const result = getFutureDateByMonths(inputDate, monthsForward);
    expect(result).toBe(expectedDate);
});

//getLastDateOfMonth
test('check for valid date end of month', () => {
    const inputDate = '2024-10-01';
    const expectedDate = '2024-10-31';
    const result = getLastDateOfMonth(inputDate);
    expect(result).toBe(expectedDate);
});

test('check for valid date end of month', () => {
    const inputDate = '2024-11-01';
    const expectedDate = '2024-11-30';
    const result = getLastDateOfMonth(inputDate);
    expect(result).toBe(expectedDate);
});

test('check for valid date end of month', () => {
    const inputDate = '2024-02-01';
    const expectedDate = '2024-02-29';
    const result = getLastDateOfMonth(inputDate);
    expect(result).toBe(expectedDate);
});

test('check for valid date end of month', () => {
    const inputDate = '2025-02-01';
    const expectedDate = '2025-02-28';
    const result = getLastDateOfMonth(inputDate);
    expect(result).toBe(expectedDate);
});