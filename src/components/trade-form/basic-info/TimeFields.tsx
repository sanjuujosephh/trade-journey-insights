
import { DateTimeField } from "./DateTimeField";
import { getDateAndTime, formatDateTime } from "@/utils/datetime";

interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TimeFields({ formData, handleChange }: TimeFieldsProps) {
  const { date: entryDate, time: entryTime } = getDateAndTime(formData.entry_time);
  const { date: exitDate, time: exitTime } = getDateAndTime(formData.exit_time);

  const handleDateChange = (type: 'entry' | 'exit') => (date: string) => {
    const currentTime = type === 'entry' ? entryTime : exitTime;
    const formattedDateTime = formatDateTime(date, currentTime);
    
    handleChange({
      target: { 
        name: `${type}_time`, 
        value: formattedDateTime || ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleTimeChange = (type: 'entry' | 'exit') => (time: string) => {
    const currentDate = type === 'entry' ? entryDate : exitDate;
    const formattedDateTime = formatDateTime(currentDate, time);
    
    handleChange({
      target: {
        name: `${type}_time`,
        value: formattedDateTime || ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <DateTimeField
        label="Entry Time"
        date={entryDate}
        time={entryTime}
        onDateChange={handleDateChange('entry')}
        onTimeChange={handleTimeChange('entry')}
        required
      />
      <DateTimeField
        label="Exit Time"
        date={exitDate}
        time={exitTime}
        onDateChange={handleDateChange('exit')}
        onTimeChange={handleTimeChange('exit')}
      />
    </div>
  );
}
