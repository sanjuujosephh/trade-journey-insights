
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { formatToIST } from "@/utils/datetime";

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
  // Initialize with current date and time if no values provided
  useEffect(() => {
    if (!date || !time) {
      const now = new Date();
      const { datePart, timePart } = formatToIST(now);
      if (!date) onDateChange(datePart);
      if (!time) onTimeChange(timePart);
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const dateDigits = value.replace(/\D/g, '');
    
    if (dateDigits.length <= 8) {
      // Format with hyphens as user types
      if (dateDigits.length > 4) {
        value = `${dateDigits.slice(0, 2)}-${dateDigits.slice(2, 4)}-${dateDigits.slice(4)}`;
      } else if (dateDigits.length > 2) {
        value = `${dateDigits.slice(0, 2)}-${dateDigits.slice(2)}`;
      } else {
        value = dateDigits;
      }
      
      onDateChange(value);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    const timeDigits = value.replace(/\D/g, '');
    const meridiem = value.match(/(AM|PM)$/i)?.[0] || '';
    
    if (timeDigits.length <= 4) {
      // Format with colon as user types
      if (timeDigits.length > 2) {
        value = `${timeDigits.slice(0, 2)}:${timeDigits.slice(2)} ${meridiem}`;
      } else {
        value = `${timeDigits} ${meridiem}`;
      }
      
      onTimeChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label} (IST)</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={date}
          onChange={handleDateChange}
          required={required}
          placeholder="DD-MM-YYYY"
          className="flex-1"
          maxLength={10}
        />
        <Input
          type="text"
          value={time}
          onChange={handleTimeChange}
          required={required}
          placeholder="HH:MM AM"
          className="w-[120px]"
          maxLength={8}
        />
      </div>
    </div>
  );
}
