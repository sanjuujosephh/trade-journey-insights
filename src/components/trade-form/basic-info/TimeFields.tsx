
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
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return { date: '', time: '' };
      
      return {
        date: date.toISOString().split('T')[0],
        time: date.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
    } catch (error) {
      console.error('Error parsing date:', error);
      return { date: '', time: '' };
    }
  };

  const { date: entryDate, time: entryTime } = getDateAndTime(formData.entry_time);
  const { date: exitDate, time: exitTime } = getDateAndTime(formData.exit_time);

  const formatDateTime = (date: string, time: string) => {
    if (!date) return '';
    if (!time) time = '00:00';
    return new Date(`${date}T${time}`).toISOString();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="entry_time">Entry Time</Label>
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
            value={entryTime}
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
              <SelectValue placeholder="Time" />
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
        <Label htmlFor="exit_time">Exit Time</Label>
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
            value={exitTime}
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
              <SelectValue placeholder="Time" />
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

