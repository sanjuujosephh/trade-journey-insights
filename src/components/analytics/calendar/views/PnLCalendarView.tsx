
import { BaseCalendarViewProps } from "../calendarTypes";
import { CalendarGrid } from "../CalendarGrid";

export function PnLCalendarView(props: BaseCalendarViewProps) {
  return (
    <div className="rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly P&L View</h3>
      <CalendarGrid
        {...props}
        view="pnl"
      />
    </div>
  );
}
