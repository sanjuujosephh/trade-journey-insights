
import { Card } from "@/components/ui/card";
import { CalendarGrid } from "../CalendarGrid";
import { TradeDay } from "../calendarUtils";

interface PnLCalendarViewProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function PnLCalendarView({
  days,
  currentDate,
  tradeDays,
  selectedDate,
  onDateSelect,
}: PnLCalendarViewProps) {
  return (
    <div className="bg-background rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly P&L View</h3>
      <CalendarGrid
        days={days}
        currentDate={currentDate}
        tradeDays={tradeDays}
        view="pnl"
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
    </div>
  );
}
