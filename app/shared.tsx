import { format, subDays, addDays, addMonths, subMonths } from 'date-fns';

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
  // Convert the current date to a Date object
  const date = new Date(currentDate);

  // Subtract the required days
  const startDate = subDays(date, daysBack);

  // Format both dates to "YYYY-MM-DD" for react-native-calendars
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  //const formattedEndDate = format(date, 'yyyy-MM-dd');
  return formattedStartDate;
  /*return {
    //startDate: formattedStartDate,
    //endDate: formattedEndDate,
  };*/
}

export function getFutureDateByDay(currentDate, daysForward) {
  // Convert the current date to a Date object
  const date = new Date(currentDate);
  
  // Add the required days
  const endDate = addDays(date, daysForward);
  
  // Format both dates to "YYYY-MM-DD" for react-native-calendars
  //const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  return formattedEndDate;
  /*return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };*/
}

export function getValidDateByWeeks(currentDate, weeksBack) {
    // Convert weeks to days
    const daysBack = weeksBack * 7;
  
    const date = new Date(currentDate);
    const startDate = subDays(date, daysBack);
  
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    //const formattedEndDate = format(date, 'yyyy-MM-dd');
    return formattedStartDate;
    /*return {
      startDate: formattedStartDate,
      //endDate: formattedEndDate,
    };*/
  }
  
export function getFutureDateByWeeks(currentDate, weeksForward) {
  // Convert weeks to days
  const daysForward = weeksForward * 7;
  
  const date = new Date(currentDate);
  const endDate = addDays(date, daysForward);
  
  //const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  return formattedEndDate;
  /*return {
    startDate: formattedStartDate,
    //endDate: formattedEndDate,
  };*/
}

export function getValidDateByMonths(currentDate, monthsBack) {
  const date = new Date(currentDate);
  const startDate = subMonths(date, monthsBack);
  
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  //const formattedEndDate = format(date, 'yyyy-MM-dd');
  return formattedStartDate;
  /*return {
    startDate: formattedStartDate,
    //endDate: formattedEndDate,
  };*/
}
  
export function getFutureDateByMonths(currentDate, monthsForward) {
  const date = new Date(currentDate);
  const endDate = addMonths(date, monthsForward);
  
  //const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  return formattedEndDate;
  /*return {
    startDate: formattedStartDate,
    //endDate: formattedEndDate,
  };*/
}

export function getLastDateOfMonth(currentDate) {
  const date = new Date(currentDate);

  // Get the year and month
  const year = date.getFullYear();
  const month = date.getMonth();

  // Create a date for the first day of the next month, then subtract 1 day
  const lastDay = new Date(year, month + 1, 0); // Day 0 = last day of the current month

  // Return the date in 'YYYY-MM-DD' format
  return lastDay.toISOString().split("T")[0];
}