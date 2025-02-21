
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarGrid } from "./calendar/CalendarGrid";
import { TradeDay } from "./calendar/calendarUtils";

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
        .select("*")
        .gte("entry_time", monthStart.toISOString())
        .lte("entry_time", monthEnd.toISOString())
        .order("entry_time");

      if (!trades) return {};

      const tradeDays: TradeDay = {};
      
      trades.forEach((trade) => {
        if (!trade.entry_time || !trade.exit_price || !trade.entry_price || !trade.quantity) return;
        
        const dayKey = format(new Date(trade.entry_time), "yyyy-MM-dd");
        if (!tradeDays[dayKey]) {
          tradeDays[dayKey] = {
            totalPnL: 0,
            tradeCount: 0,
            vix: trade.vix,
            callIv: trade.call_iv,
            putIv: trade.put_iv,
            marketCondition: trade.market_condition,
            riskReward: trade.planned_risk_reward,
            emotionalState: trade.entry_emotion,
            confidenceLevel: trade.confidence_level,
            disciplineScore: trade.followed_plan ? 100 : 0
          };
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

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });

  return (
    <div className="p-4 space-y-8">
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

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="options">Options Data</TabsTrigger>
          <TabsTrigger value="psychology">Psychology Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="pnl"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <CalendarGrid
            days={daysInWeek}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="pnl"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </TabsContent>

        <TabsContent value="options" className="space-y-4">
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="options"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </TabsContent>

        <TabsContent value="psychology" className="space-y-4">
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="psychology"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
