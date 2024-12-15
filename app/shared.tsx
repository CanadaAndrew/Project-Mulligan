import { format, subDays, addDays, addMonths, subMonths, parseISO } from 'date-fns';

/* getValidDateRangeDayBack
    input:  current date and number of days to be subtracted
    output:  valid beginning and ending dates
  getFutureDateRangeByDay
    input:  current date and number of days to be added
    output:  valid beginning and ending dates
  getValidDateRangeByWeeks
    input:  current date and number of weeks to be subtracted
    output:  valid beginning and ending dates
  getFutureDateRangeByWeeks
    input:  current date and number of weeks to be added
    output:  valid beginning and ending dates
  getValidDateRangeByMonths
    input:  current date and number of months to be subtracted
    output:  valid beginning and ending dates
  getFutureDateRangeByMonths
    input:  current date and number of months to be added
    output:  valid beginning and ending of dates
  getLastDateOfMonth
    input:  current date
    output:  valid last date of month*/

export function getValidDateDayBack(currentDate, daysBack) {
  const date = parseISO(currentDate);
  const startDate = subDays(date, daysBack);
  return format(startDate, 'yyyy-MM-dd');
}

export function getFutureDateByDay(currentDate, daysForward) {
  const date = parseISO(currentDate);
  const endDate = addDays(date, daysForward);
  return format(endDate, 'yyyy-MM-dd');
}

export function getValidDateByWeeks(currentDate, weeksBack) {
    const daysBack = weeksBack * 7;
    const date = parseISO(currentDate);
    const startDate = subDays(date, daysBack);
    return format(startDate, 'yyyy-MM-dd');
  }
  
export function getFutureDateByWeeks(currentDate, weeksForward) {
  const daysForward = weeksForward * 7;
  const date = parseISO(currentDate);
  const endDate = addDays(date, daysForward);
  return format(endDate, 'yyyy-MM-dd');
}

export function getValidDateByMonths(currentDate, monthsBack) {
  const date = parseISO(currentDate);
  const startDate = subMonths(date, monthsBack);
  return format(startDate, 'yyyy-MM-dd');
}
  
export function getFutureDateByMonths(currentDate, monthsForward) {
  const date = parseISO(currentDate);
  const endDate = addMonths(date, monthsForward);
  return format(endDate, 'yyyy-MM-dd');
}

export function getLastDateOfMonth(currentDate) {
  const date = parseISO(currentDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0); // Day 0 = last day of current month
  return lastDay.toISOString().split("T")[0];
}