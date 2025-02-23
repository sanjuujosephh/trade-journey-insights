
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeSelector } from "./TimeSelector";

interface DateTimeFieldProps {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  timeOptions: { value: string; label: string; }[];
  required?: boolean;
}

export function DateTimeField({ 
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  timeOptions,
  required = false
}: DateTimeFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label} (IST)</Label>
      <div className="flex gap-2">
        <Input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required={required}
          className="flex-1"
        />
        <TimeSelector
          value={time}
          onValueChange={onTimeChange}
          timeOptions={timeOptions}
        />
      </div>
    </div>
  );
}
