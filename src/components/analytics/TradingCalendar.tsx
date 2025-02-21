
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DayStats {
  totalPnL: number;
  tradeCount: number;
  vix?: number;
  callIv?: number;
  putIv?: number;
  marketCondition?: string;
  riskReward?: number;
  emotionalState?: string;
  confidenceLevel?: number;
  disciplineScore?: number;
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

  const renderDayCell = (day: Date, view: 'pnl' | 'options' | 'psychology') => {
    const dayKey = format(day, "yyyy-MM-dd");
    const dayStats = tradeDays[dayKey];
    const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === dayKey;

    let content;
    let tooltipContent;

    switch (view) {
      case 'options':
        content = dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] space-y-1">
              {dayStats.vix && <div>VIX: {dayStats.vix.toFixed(1)}</div>}
              {dayStats.callIv && <div>Call IV: {dayStats.callIv.toFixed(1)}</div>}
              {dayStats.putIv && <div>Put IV: {dayStats.putIv.toFixed(1)}</div>}
            </div>
          </>
        );
        tooltipContent = dayStats && (
          <>
            <div>VIX: {dayStats.vix?.toFixed(1) || 'N/A'}</div>
            <div>Call IV: {dayStats.callIv?.toFixed(1) || 'N/A'}</div>
            <div>Put IV: {dayStats.putIv?.toFixed(1) || 'N/A'}</div>
          </>
        );
        break;
      case 'psychology':
        content = dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] space-y-1">
              {dayStats.emotionalState && (
                <div className="capitalize">{dayStats.emotionalState}</div>
              )}
              {dayStats.confidenceLevel && (
                <div>Conf: {dayStats.confidenceLevel}%</div>
              )}
            </div>
          </>
        );
        tooltipContent = dayStats && (
          <>
            <div>Market: {dayStats.marketCondition || 'N/A'}</div>
            <div>R/R: {dayStats.riskReward?.toFixed(1) || 'N/A'}</div>
            <div>Emotion: {dayStats.emotionalState || 'N/A'}</div>
            <div>Confidence: {dayStats.confidenceLevel || 'N/A'}%</div>
            <div>Discipline: {dayStats.disciplineScore || 'N/A'}%</div>
          </>
        );
        break;
      default:
        content = dayStats && (
          <>
            <div className="font-medium mb-1">{format(day, "d")}</div>
            <div className="text-[10px] font-medium">
              {formatPnL(dayStats.totalPnL)}
            </div>
          </>
        );
        tooltipContent = dayStats && (
          <>
            <div>P&L: {formatPnL(dayStats.totalPnL)}</div>
            <div>Trades: {dayStats.tradeCount}</div>
          </>
        );
    }

    return (
      <TooltipProvider key={dayKey}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSelectedDate(isSelected ? null : day)}
              className={cn(
                "py-2 px-1 rounded-md text-xs transition-colors min-h-[60px] w-full",
                !isSameMonth(day, currentDate) && "opacity-50",
                isToday(day) && "ring-1 ring-primary",
                isSelected && "ring-1 ring-primary ring-offset-2",
                dayStats
                  ? getPnLColor(dayStats.totalPnL)
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              )}
            >
              {content || <div className="font-medium">{format(day, "d")}</div>}
            </button>
          </TooltipTrigger>
          {dayStats && tooltipContent && (
            <TooltipContent>
              <div className="text-sm">{tooltipContent}</div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderCalendarGrid = (days: Date[]) => (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div
          key={day}
          className="text-center py-2 text-xs font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
      {days.map((day) => renderDayCell(day, 'pnl'))}
    </div>
  );

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });
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
          {renderCalendarGrid(daysInMonth)}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div
                key={day}
                className="text-center py-2 text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {daysInWeek.map((day) => renderDayCell(day, 'pnl'))}
          </div>
        </TabsContent>

        <TabsContent value="options" className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div
                key={day}
                className="text-center py-2 text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => renderDayCell(day, 'options'))}
          </div>
        </TabsContent>

        <TabsContent value="psychology" className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div
                key={day}
                className="text-center py-2 text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => renderDayCell(day, 'psychology'))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
