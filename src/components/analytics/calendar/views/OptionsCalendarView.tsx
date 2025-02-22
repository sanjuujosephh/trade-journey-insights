
import { BaseCalendarViewProps } from "../calendarTypes";
import { CalendarGrid } from "../CalendarGrid";

export function OptionsCalendarView(props: BaseCalendarViewProps) {
  return (
    <div className="bg-background rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Options Data</h3>
      <CalendarGrid
        {...props}
        view="options"
      />
    </div>
  );
}
