
import { DateTimeField } from "./DateTimeField";
import { useEffect } from "react";
import { parseTimeString } from "@/utils/datetime";

interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TimeFields({ formData, handleChange }: TimeFieldsProps) {
  const handleDateChange = (date: string) => {
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
    handleChange({
      target: {
        name: `${type}_time`,
        value: time
      }
    } as React.ChangeEvent<HTMLInputElement>);

    if (time.length >= 8) {
      const validTime = parseTimeString(time);
      if (!validTime && time !== '') {
        console.log('Invalid time format:', time);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full">
        <DateTimeField
          label="Trade Date"
          date={formData.entry_date || ''}
          time=""
          onDateChange={handleDateChange}
          onTimeChange={() => {}}
          hideTime
          required
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <DateTimeField
            label="Entry Time"
            date=""
            time={formData.entry_time || ''}
            onDateChange={() => {}}
            onTimeChange={handleTimeChange('entry')}
            hideDate
            required
          />
        </div>
        <div className="flex-1">
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
    </div>
  );
}
