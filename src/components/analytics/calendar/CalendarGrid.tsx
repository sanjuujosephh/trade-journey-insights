
import dayjs from "dayjs";
import { DayStats, TradeDay } from "./calendarUtils";
import { CalendarDayCell } from "./CalendarDayCell";

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  view: 'pnl' | 'options' | 'psychology';
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({ 
  days, 
  currentDate, 
  tradeDays,
  view,
  selectedDate,
  onDateSelect
}: CalendarGridProps) {
  const formatDateKey = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD');
  };

  // Get the day of week for the first day of the month
  const firstDayOfMonth = dayjs(currentDate).startOf('month');
  const startingDayOfWeek = firstDayOfMonth.day();

  // Create array for empty cells before the first day
  const emptyCells = Array(startingDayOfWeek).fill(null);

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div
          key={day}
          className="text-center py-2 text-xs font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
      {emptyCells.map((_, index) => (
        <div key={`empty-${index}`} className="min-h-[75px]" />
      ))}
      {days.map((day) => (
        <CalendarDayCell
          key={day.toString()}
          day={day}
          currentDate={currentDate}
          dayStats={tradeDays[formatDateKey(day)]}
          view={view}
          isSelected={selectedDate ? formatDateKey(selectedDate) === formatDateKey(day) : false}
          onSelect={onDateSelect}
        />
      ))}
    </div>
  );
}
