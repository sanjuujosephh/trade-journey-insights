
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayStats {
  totalPnL: number;
  tradeCount: number;
}

interface TradeDay {
  [key: string]: DayStats;
}

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: tradeDays = {} } = useQuery({
    queryKey: ["calendar-trades", format(currentDate, "yyyy-MM")],
    queryFn: async () => {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const { data: trades } = await supabase
        .from("trades")
        .select("entry_time, exit_price, entry_price, quantity")
        .gte("entry_time", monthStart.toISOString())
        .lte("entry_time", monthEnd.toISOString())
        .order("entry_time");

      if (!trades) return {};

      const tradeDays: TradeDay = {};
      
      trades.forEach((trade) => {
        if (!trade.entry_time || !trade.exit_price || !trade.entry_price || !trade.quantity) return;
        
        const dayKey = format(new Date(trade.entry_time), "yyyy-MM-dd");
        if (!tradeDays[dayKey]) {
          tradeDays[dayKey] = { totalPnL: 0, tradeCount: 0 };
        }
        
        tradeDays[dayKey].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
        tradeDays[dayKey].tradeCount += 1;
      });

      return tradeDays;
    },
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return "bg-green-100 hover:bg-green-200 text-green-800";
    if (pnl < 0) return "bg-red-100 hover:bg-red-200 text-red-800";
    return "bg-gray-100 hover:bg-gray-200 text-gray-600";
  };

  const formatPnL = (pnl: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pnl);
  };

  return (
    <div className="p-4 space-y-3">
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

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div
            key={day}
            className="text-center py-1 text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map(day => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayStats = tradeDays[dayKey];
          const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === dayKey;

          return (
            <TooltipProvider key={dayKey}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={cn(
                      "p-1 rounded-md text-xs transition-colors",
                      !isSameMonth(day, currentDate) && "opacity-50",
                      isToday(day) && "ring-1 ring-primary",
                      isSelected && "ring-1 ring-primary ring-offset-2",
                      dayStats
                        ? getPnLColor(dayStats.totalPnL)
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    )}
                  >
                    <div className="font-medium">{format(day, "d")}</div>
                    {dayStats && (
                      <div className="text-[10px] font-medium">
                        {formatPnL(dayStats.totalPnL)}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                {dayStats && (
                  <TooltipContent>
                    <div className="text-sm">
                      <div>P&L: {formatPnL(dayStats.totalPnL)}</div>
                      <div>Trades: {dayStats.tradeCount}</div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
