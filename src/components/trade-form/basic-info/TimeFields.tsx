
import { DateTimeField } from "./DateTimeField";

interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TimeFields({ formData, handleChange }: TimeFieldsProps) {
  const handleDateChange = (type: 'entry' | 'exit') => (date: string) => {
    handleChange({
      target: { 
        name: `${type}_date`, 
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
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <DateTimeField
        label="Entry Time"
        date={formData.entry_date || ''}
        time={formData.entry_time || ''}
        onDateChange={handleDateChange('entry')}
        onTimeChange={handleTimeChange('entry')}
        required
      />
      <DateTimeField
        label="Exit Time"
        date={formData.exit_date || ''}
        time={formData.exit_time || ''}
        onDateChange={handleDateChange('exit')}
        onTimeChange={handleTimeChange('exit')}
      />
    </div>
  );
}
