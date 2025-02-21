
import { DayStats, TradeDay } from "./calendarUtils";

interface CalendarGridProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  view: 'pnl' | 'options' | 'psychology';
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

import { CalendarDayCell } from "./CalendarDayCell";

export function CalendarGrid({ 
  days, 
  currentDate, 
  tradeDays,
  view,
  selectedDate,
  onDateSelect
}: CalendarGridProps) {
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
      {days.map((day) => (
        <CalendarDayCell
          key={day.toString()}
          day={day}
          currentDate={currentDate}
          dayStats={tradeDays[day.toISOString().split('T')[0]]}
          view={view}
          isSelected={selectedDate ? selectedDate.toISOString().split('T')[0] === day.toISOString().split('T')[0] : false}
          onSelect={onDateSelect}
        />
      ))}
    </div>
  );
}
