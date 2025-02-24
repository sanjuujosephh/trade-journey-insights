
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
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty value or validate date format
    if (!value || /^(\d{2}-\d{2}-\d{4})?$/.test(value)) {
      onDateChange(value);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty value or validate time format
    if (!value || /^(\d{2}:\d{2}\s?(?:AM|PM))?$/i.test(value)) {
      onTimeChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label} (IST)</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={date || ''}
          onChange={handleDateChange}
          required={required}
          placeholder="DD-MM-YYYY"
          className="flex-1"
        />
        <Input
          type="text"
          value={time || ''}
          onChange={handleTimeChange}
          required={required}
          placeholder="HH:MM AM"
          className="w-[120px]"
        />
      </div>
    </div>
  );
}
