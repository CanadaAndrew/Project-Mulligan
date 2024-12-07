import { format, subDays, addDays, addMonths, subMonths } from 'date-fns';

/* getValidDateRangeDayBack
    input:  current date and number of days to be subtracted
    output:  valid beginning and ending dates
  getValidDateRangeDayForward
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
    output:  valid beginning and ending of dates*/

export function getValidDateRangeDayBack(currentDate, daysBack) {
  // Convert the current date to a Date object
  const date = new Date(currentDate);

  // Subtract the required days
  const startDate = subDays(date, daysBack);

  // Format both dates to "YYYY-MM-DD" for react-native-calendars
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(date, 'yyyy-MM-dd');

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export function getValidDateRangeDayForward(currentDate, daysForward) {
  // Convert the current date to a Date object
  const date = new Date(currentDate);
  
  // Add the required days
  const endDate = addDays(date, daysForward);
  
  // Format both dates to "YYYY-MM-DD" for react-native-calendars
  const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export function getValidDateRangeByWeeks(currentDate, weeksBack) {
    // Convert weeks to days
    const daysBack = weeksBack * 7;
  
    const date = new Date(currentDate);
    const startDate = subDays(date, daysBack);
  
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(date, 'yyyy-MM-dd');
  
    return {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }
  
export function getFutureDateRangeByWeeks(currentDate, weeksForward) {
  // Convert weeks to days
  const daysForward = weeksForward * 7;
  
  const date = new Date(currentDate);
  const endDate = addDays(date, daysForward);
  
  const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}

export function getValidDateRangeByMonths(currentDate, monthsBack) {
  const date = new Date(currentDate);
  const startDate = subMonths(date, monthsBack);
  
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(date, 'yyyy-MM-dd');
  
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}
  
export function getFutureDateRangeByMonths(currentDate, monthsForward) {
  const date = new Date(currentDate);
  const endDate = addMonths(date, monthsForward);
  
  const formattedStartDate = format(date, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
}