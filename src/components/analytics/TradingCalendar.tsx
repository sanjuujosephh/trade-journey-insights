
import { useState } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useTradeDays } from "@/hooks/useTradeDays";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { PnLCalendarView } from "./calendar/views/PnLCalendarView";
import { OptionsCalendarView } from "./calendar/views/OptionsCalendarView";
import { PsychologyCalendarView } from "./calendar/views/PsychologyCalendarView";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: tradeDays = {}, isLoading } = useTradeDays(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePreviousMonth = () => {
    setCurrentDate(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(date => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading calendar data...</div>;
  }

  return (
    <div className="space-y-8">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="space-y-8">
        <ErrorBoundary>
          <PnLCalendarView
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <OptionsCalendarView
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <PsychologyCalendarView
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
