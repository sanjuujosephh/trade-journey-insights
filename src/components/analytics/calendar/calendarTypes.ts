
import { DayStats, TradeDay } from "./calendarUtils";

export type CalendarViewType = 'pnl' | 'options' | 'psychology';

export interface BaseCalendarViewProps {
  days: Date[];
  currentDate: Date;
  tradeDays: TradeDay;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}
