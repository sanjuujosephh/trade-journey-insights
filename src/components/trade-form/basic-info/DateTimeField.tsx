
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
  required = false,
}: DateTimeFieldProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent time value from interfering with date field
    const newDate = e.target.value;
    onDateChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent date value from interfering with time field
    const newTime = e.target.value;
    onTimeChange(newTime);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={date}
          onChange={handleDateChange}
          placeholder="DD-MM-YYYY"
          required={required}
          className="flex-1"
        />
        <Input
          type="text"
          value={time}
          onChange={handleTimeChange}
          placeholder="HH:MM AM/PM"
          required={required}
          className="w-[120px]"
        />
      </div>
    </div>
  );
}
