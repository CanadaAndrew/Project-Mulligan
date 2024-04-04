import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { handleDatesSelected } from './calendarUtils';

interface MyCalendarProps {
  pageName: string;
  onDatesSelected: (selectedDates: string[]) => void;
  disabled?: boolean;
}


const MyCalendar = React.forwardRef(({ pageName, disabled = false }: MyCalendarProps, ref) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleDayPress = (day: any) => {
    if (disabled) {
      // If disabled, do not update selected dates
      return;
    }

    const isSelected = selectedDates.includes(day.dateString);
    const newSelectedDates = isSelected
      ? selectedDates.filter((date) => date !== day.dateString)
      : [...selectedDates, day.dateString];

    setSelectedDates(newSelectedDates);
    handleDatesSelected(newSelectedDates, pageName);
  };
  
  // Use ref to assign the markedDates prop
  React.useImperativeHandle(ref, () => ({
    markedDates: selectedDates
  }), [selectedDates]);

  /* Getter to allow other pages to grab dates from calendar
  Example: const selectedDates = calendarContainerRef.current.getSelectedDates();*/
  const getSelectedDates = () => {
    return selectedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates.reduce((obj, date) => {
          obj[date] = { selected: true, selectedColor: '#C154C1' };
          return obj;
        }, {})}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});

export default MyCalendar;