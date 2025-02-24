
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'dd-MM-yyyy');
      onDateChange(formattedDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let timeValue = e.target.value;
    
    // Allow typing by immediately passing the value
    onTimeChange(timeValue);
    
    // Format if it matches the expected pattern
    if (/^(0?[1-9]|1[0-2]):[0-5][0-9]$/.test(timeValue)) {
      timeValue += ' AM';
      onTimeChange(timeValue);
    }
  };

  // Parse the date string to a Date object for the calendar
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('-').map(Number);
    if (!day || !month || !year) return undefined;
    return new Date(year, month - 1, day);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? date : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parseDate(date)}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
