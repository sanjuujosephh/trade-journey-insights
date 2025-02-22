
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTradeDays } from "@/hooks/useTradeDays";
import { PnLCalendarView } from "./calendar/views/PnLCalendarView";
import { OptionsCalendarView } from "./calendar/views/OptionsCalendarView";
import { PsychologyCalendarView } from "./calendar/views/PsychologyCalendarView";

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: tradeDays = {} } = useTradeDays(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date())}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(date => {
              const newDate = new Date(date);
              newDate.setMonth(date.getMonth() - 1);
              return newDate;
            })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(date => {
              const newDate = new Date(date);
              newDate.setMonth(date.getMonth() + 1);
              return newDate;
            })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <PnLCalendarView
          days={daysInMonth}
          currentDate={currentDate}
          tradeDays={tradeDays}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <OptionsCalendarView
          days={daysInMonth}
          currentDate={currentDate}
          tradeDays={tradeDays}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <PsychologyCalendarView
          days={daysInMonth}
          currentDate={currentDate}
          tradeDays={tradeDays}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  );
}
