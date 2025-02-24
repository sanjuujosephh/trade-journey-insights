
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
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
  required = false
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
    const value = e.target.value;
    onDateChange(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onTimeChange(value);
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
        />
        <Input
          type="text"
          value={time}
          onChange={handleTimeChange}
          required={required}
          placeholder="HH:MM AM"
          className="w-[120px]"
        />
      </div>
    </div>
  );
}
