
import { DateTimeField } from "./DateTimeField";
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
  };

  const handleTimeChange = (type: 'entry' | 'exit') => (time: string) => {
    // Validate time format before updating
    const isValidTime = parseTimeString(time);
    if (isValidTime || time === '') {
      handleChange({
        target: {
          name: `${type}_time`,
          value: time
        }
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (time.length >= 8) { // Length of "HH:MM AM" or "HH:MM PM"
      console.warn('Invalid time format:', time);
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
