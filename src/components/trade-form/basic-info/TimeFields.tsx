
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateTimeChange: (type: 'entry' | 'exit', timeStr: string) => void;
  timeOptions: { value: string; label: string; }[];
}

export function TimeFields({ formData, handleChange, handleDateTimeChange, timeOptions }: TimeFieldsProps) {
  const getDateAndTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { date: '', time: '' };
    try {
      // Create date object and convert to IST
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return { date: '', time: '' };
      
      // Adjust to IST (UTC+5:30)
      const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      
      // Format date to YYYY-MM-DD
      const yyyy = istDate.getUTCFullYear();
      const mm = String(istDate.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(istDate.getUTCDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      
      // Format time to HH:mm
      const hours = String(istDate.getUTCHours()).padStart(2, '0');
      const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      
      console.log('Processing datetime:', dateTimeStr);
      console.log('Formatted date (IST):', formattedDate);
      console.log('Formatted time (IST):', formattedTime);
      
      return {
        date: formattedDate,
        time: formattedTime
      };
    } catch (error) {
      console.error('Error parsing date:', error);
      return { date: '', time: '' };
    }
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date) return '';
    if (!time) time = '00:00';
    
    try {
      // Parse the date and time in IST
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      
      // Create date object in IST
      const dateObj = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours) - 5, // Adjust for IST offset (-5:30)
        parseInt(minutes) - 30
      ));
      
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toISOString();
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };

  const { date: entryDate, time: entryTime } = getDateAndTime(formData.entry_time);
  const { date: exitDate, time: exitTime } = getDateAndTime(formData.exit_time);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="entry_time">Entry Time (IST)</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={entryDate}
            onChange={(e) => {
              if (!e.target.value) {
                handleChange({
                  target: { name: 'entry_time', value: '' }
                } as React.ChangeEvent<HTMLInputElement>);
                return;
              }
              handleChange({
                target: { 
                  name: 'entry_time', 
                  value: formatDateTime(e.target.value, entryTime)
                }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            required
            className="flex-1"
          />
          <Select
            defaultValue={entryTime}
            onValueChange={(value) => {
              if (entryDate) {
                handleChange({
                  target: {
                    name: 'entry_time',
                    value: formatDateTime(entryDate, value)
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <SelectTrigger className="w-[100px]">
              <Clock className="h-[1.2rem] w-[1.2rem] mr-2" />
              <SelectValue placeholder="Time" defaultValue={entryTime}>
                {entryTime || "Time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer hover:bg-accent"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="exit_time">Exit Time (IST)</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={exitDate}
            onChange={(e) => {
              if (!e.target.value) {
                handleChange({
                  target: { name: 'exit_time', value: '' }
                } as React.ChangeEvent<HTMLInputElement>);
                return;
              }
              handleChange({
                target: { 
                  name: 'exit_time', 
                  value: formatDateTime(e.target.value, exitTime)
                }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="flex-1"
          />
          <Select
            defaultValue={exitTime}
            onValueChange={(value) => {
              if (exitDate) {
                handleChange({
                  target: {
                    name: 'exit_time',
                    value: formatDateTime(exitDate, value)
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <SelectTrigger className="w-[100px]">
              <Clock className="h-[1.2rem] w-[1.2rem] mr-2" />
              <SelectValue placeholder="Time" defaultValue={exitTime}>
                {exitTime || "Time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer hover:bg-accent"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
