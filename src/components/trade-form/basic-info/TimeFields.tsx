
import { DateTimeField } from "./DateTimeField";
import { parseTimeString } from "@/utils/datetime";
interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function TimeFields({
  formData,
  handleChange
}: TimeFieldsProps) {
  const handleDateChange = (field: 'entry_date' | 'exit_date') => (date: string) => {
    handleChange({
      target: {
        name: field,
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
  
  return <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DateTimeField 
          label="Entry Date" 
          date={formData.entry_date || ''} 
          time="" 
          onDateChange={handleDateChange('entry_date')} 
          onTimeChange={() => {}} 
          hideTime 
          required 
        />
        <DateTimeField 
          label="Exit Date" 
          date={formData.exit_date || ''} 
          time="" 
          onDateChange={handleDateChange('exit_date')} 
          onTimeChange={() => {}} 
          hideTime 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      
      <div className="text-xs text-muted-foreground">⚠︎ Time format: HH:MM (e.g., 10:30 or 14:45) and date format: DD-MM-YYYY</div>
    </div>;
}
