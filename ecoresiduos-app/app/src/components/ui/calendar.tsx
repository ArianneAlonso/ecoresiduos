'use client';

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: 'single' | 'multiple' | 'range';
  showOutsideDays?: boolean;
  className?: string;
  style?: ViewStyle;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  children?: React.ReactNode;
}

interface DayProps {
  day: Date;
  selected?: boolean;
  today?: boolean;
  disabled?: boolean;
  onSelect?: (day: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  mode = 'single',
  showOutsideDays = true,
  style,
  month = new Date(),
  onMonthChange,
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(month);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const isSelected = (day: Date): boolean => {
    if (!selected) return false;
    if (mode === 'single') return selected.getTime() === day.getTime();
    return false; // Simplified for now
  };

  const DayCell: React.FC<DayProps> = ({ day, selected, today, onSelect }) => (
    <TouchableOpacity
      style={[
        styles.day,
        selected && styles.daySelected,
        today && styles.dayToday,
      ]}
      onPress={() => onSelect?.(day)}
      disabled={!showOutsideDays}
    >
      <Text style={styles.dayText}>{day.getDate()}</Text>
    </TouchableOpacity>
  );

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before month start
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayEmpty} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <DayCell
          key={day}
          day={date}
          selected={isSelected(date)}
          today={isToday}
          onSelect={onSelect}
        />
      );
    }

    return days;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <View style={[styles.calendar, style]} {...props}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevMonth}>
          <ChevronLeft size={20} color="#6b7280" />
        </TouchableOpacity>
        
        <Text style={styles.caption}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity style={styles.navButton} onPress={handleNextMonth}>
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdays}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <Text key={day} style={styles.weekday}>{day}</Text>
        ))}
      </View>

      {/* Days grid */}
      <ScrollView 
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={styles.daysGrid}
      >
        <View style={styles.weekRow}>
          {renderDays()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  caption: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  daysGrid: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayEmpty: {
    width: 40,
    height: 40,
  },
  day: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  daySelected: {
    backgroundColor: '#1f5c2e',
  },
  dayToday: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export { Calendar };
export type { CalendarProps };

export default function _Component() { return null; }
