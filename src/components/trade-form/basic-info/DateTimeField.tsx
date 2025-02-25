
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
  hideDate?: boolean;
  hideTime?: boolean;
}

export function DateTimeField({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  required = false,
  hideDate = false,
  hideTime = false,
}: DateTimeFieldProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'dd-MM-yyyy');
      onDateChange(formattedDate);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Always pass the raw value to parent
    onTimeChange(value);
    
    // Auto-format the time input if it matches certain patterns
    if (value.length === 5 && /^\d{2}:\d{2}$/.test(value)) {
      const hour = parseInt(value.split(':')[0]);
      if (hour >= 0 && hour <= 23) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour > 12 ? String(hour - 12).padStart(2, '0') : 
                             hour === 0 ? '12' : 
                             String(hour).padStart(2, '0');
        value = `${formattedHour}:${value.split(':')[1]} ${ampm}`;
        onTimeChange(value);
      }
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
        {!hideDate && (
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
        )}
        {!hideTime && (
          <Input
            type="text"
            value={time}
            onChange={handleTimeChange}
            placeholder="HH:MM"
            required={required}
            className="w-[120px]"
          />
        )}
      </div>
    </div>
  );
}
