
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTradeDays } from "@/hooks/useTradeDays";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { PnLCalendarView } from "./calendar/views/PnLCalendarView";
import { OptionsCalendarView } from "./calendar/views/OptionsCalendarView";
import { PsychologyCalendarView } from "./calendar/views/PsychologyCalendarView";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to user's local timezone
dayjs.tz.setDefault(dayjs.tz.guess());

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const { data: tradeDays = {}, isLoading } = useTradeDays(currentDate.toDate());

  // Generate days in the current month
  const daysInMonth = Array.from({ length: currentDate.daysInMonth() }, (_, i) => {
    return currentDate.startOf('month').add(i, 'day').toDate();
  });

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(dayjs(date));
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading calendar data...</div>;
  }

  return (
    <div className="space-y-8">
      <CalendarHeader
        currentDate={currentDate.toDate()}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="space-y-8">
        <ErrorBoundary>
          <PnLCalendarView
            days={daysInMonth}
            currentDate={currentDate.toDate()}
            tradeDays={tradeDays}
            selectedDate={selectedDate?.toDate() || null}
            onDateSelect={handleDateSelect}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <OptionsCalendarView
            days={daysInMonth}
            currentDate={currentDate.toDate()}
            tradeDays={tradeDays}
            selectedDate={selectedDate?.toDate() || null}
            onDateSelect={handleDateSelect}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <PsychologyCalendarView
            days={daysInMonth}
            currentDate={currentDate.toDate()}
            tradeDays={tradeDays}
            selectedDate={selectedDate?.toDate() || null}
            onDateSelect={handleDateSelect}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
