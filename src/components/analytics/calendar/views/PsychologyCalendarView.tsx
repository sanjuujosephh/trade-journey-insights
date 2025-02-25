
import { CalendarGrid } from "../CalendarGrid";
import { TradeDay } from "../calendarUtils";

interface PsychologyCalendarViewProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function PsychologyCalendarView({
  days,
  currentDate,
  tradeDays,
  selectedDate,
  onDateSelect,
}: PsychologyCalendarViewProps) {
  return (
    <div className="rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Psychology Tracker</h3>
      <CalendarGrid
        days={days}
        currentDate={currentDate}
        tradeDays={tradeDays}
        view="psychology"
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}
