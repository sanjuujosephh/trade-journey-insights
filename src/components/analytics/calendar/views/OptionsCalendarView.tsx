
import { Card } from "@/components/ui/card";
import { CalendarGrid } from "../CalendarGrid";
import { TradeDay } from "../calendarUtils";

interface OptionsCalendarViewProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function OptionsCalendarView({
  days,
  currentDate,
  tradeDays,
  selectedDate,
  onDateSelect,
}: OptionsCalendarViewProps) {
  return (
    <div className="bg-background rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Options Data</h3>
      <CalendarGrid
        days={days}
        currentDate={currentDate}
        tradeDays={tradeDays}
        view="options"
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}
