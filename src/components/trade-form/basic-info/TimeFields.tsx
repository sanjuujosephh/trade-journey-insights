
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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="entry_time">Entry Time</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={formData.entry_time?.split('T')[0] || ''}
            onChange={(e) => {
              const timeStr = formData.entry_time?.split('T')[1] || '09:15';
              const newDateTime = `${e.target.value}T${timeStr}`;
              handleChange({
                target: { name: 'entry_time', value: newDateTime }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            required
            className="flex-1"
          />
          <Select
            value={formData.entry_time?.split('T')[1] || ''}
            onValueChange={(value) => handleDateTimeChange('entry', value)}
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
            value={formData.exit_time?.split('T')[0] || ''}
            onChange={(e) => {
              const timeStr = formData.exit_time?.split('T')[1] || '09:15';
              const newDateTime = `${e.target.value}T${timeStr}`;
              handleChange({
                target: { name: 'exit_time', value: newDateTime }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="flex-1"
          />
          <Select
            value={formData.exit_time?.split('T')[1] || ''}
            onValueChange={(value) => handleDateTimeChange('exit', value)}
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
