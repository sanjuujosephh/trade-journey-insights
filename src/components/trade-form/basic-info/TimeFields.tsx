
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
    // Always update form data immediately for better UX
    handleChange({
      target: {
        name: `${type}_time`,
        value: time
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="text-xs text-muted-foreground">
        Time format: HH:MM (e.g., 10:30 AM)
      </div>
    </div>
  );
}
