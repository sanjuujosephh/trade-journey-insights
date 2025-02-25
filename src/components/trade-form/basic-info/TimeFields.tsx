
import { DateTimeField } from "./DateTimeField";
import { useEffect } from "react";
import { parseTimeString } from "@/utils/datetime";

interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TimeFields({ formData, handleChange }: TimeFieldsProps) {
  const handleDateChange = (date: string) => {
    // Set the same date for both entry and exit
    handleChange({
      target: { 
        name: 'entry_date', 
        value: date
      }
    } as React.ChangeEvent<HTMLInputElement>);
    
    handleChange({
      target: {
        name: 'exit_date',
        value: date
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleTimeChange = (type: 'entry' | 'exit') => (time: string) => {
    // Allow typing at all times
    handleChange({
      target: {
        name: `${type}_time`,
        value: time
      }
    } as React.ChangeEvent<HTMLInputElement>);

    // Only validate completed time strings
    if (time.length >= 8) {  // Length of "HH:MM AM" or "HH:MM PM"
      const validTime = parseTimeString(time);
      if (!validTime && time !== '') {
        console.log('Invalid time format:', time);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <DateTimeField
          label="Trade Date"
          date={formData.entry_date || ''}
          time=""
          onDateChange={handleDateChange}
          onTimeChange={() => {}}
          hideTime
          required
        />
        <DateTimeField
          label="Entry Time"
          date=""
          time={formData.entry_time || ''}
          onDateChange={() => {}}
          onTimeChange={handleTimeChange('entry')}
          hideDate
          required
        />
        <DateTimeField
          label="Exit Time"
          date=""
          time={formData.exit_time || ''}
          onDateChange={() => {}}
          onTimeChange={handleTimeChange('exit')}
          hideDate
        />
      </div>
    </div>
  );
}

