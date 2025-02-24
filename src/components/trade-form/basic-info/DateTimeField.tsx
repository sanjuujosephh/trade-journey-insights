
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeFieldProps {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  required?: boolean;
}

export function DateTimeField({ 
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  required = false
}: DateTimeFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label} (IST)</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required={required}
          placeholder="DD-MM-YYYY"
          className="flex-1"
        />
        <Input
          type="text"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          required={required}
          placeholder="HH:MM AM"
          className="w-[120px]"
        />
      </div>
    </div>
  );
}
