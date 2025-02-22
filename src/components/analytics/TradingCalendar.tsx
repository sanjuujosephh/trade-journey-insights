
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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

      console.log("Fetching trades for:", {
        monthStart: monthStart.toISOString(),
        monthEnd: monthEnd.toISOString()
      });

      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .gte("entry_time", monthStart.toISOString())
        .lte("entry_time", monthEnd.toISOString())
        .order("entry_time");

      if (error) {
        console.error("Supabase query error:", error);
        return {};
      }

      console.log("Received trades:", trades);

      if (!trades) return {};

      const tradeDays: TradeDay = {};
      
      trades.forEach((trade) => {
        if (!trade.entry_time) {
          console.log("Trade missing entry_time:", trade);
          return;
        }
        
        const dayKey = format(new Date(trade.entry_time), "yyyy-MM-dd");
        console.log("Processing trade for day:", dayKey, trade);

        if (!tradeDays[dayKey]) {
          tradeDays[dayKey] = {
            totalPnL: 0,
            tradeCount: 0,
            vix: trade.vix || undefined,
            callIv: trade.call_iv || undefined,
            putIv: trade.put_iv || undefined,
            marketCondition: trade.market_condition || undefined,
            riskReward: undefined,
            emotionalState: trade.overall_emotional_state || undefined,
            emotionalScore: trade.emotional_score || undefined,
            confidenceScore: trade.confidence_level_score || undefined,
            disciplineScore: undefined,
            vwapPosition: trade.vwap_position || undefined,
            emaPosition: trade.ema_position || undefined,
            option_type: trade.option_type || undefined,
            trade_direction: trade.trade_direction || undefined
          };
        }
        
        // Calculate P&L
        if (trade.exit_price && trade.entry_price && trade.quantity) {
          tradeDays[dayKey].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
        }
        tradeDays[dayKey].tradeCount += 1;

        // Calculate and set risk/reward ratio with logging
        console.log("Risk/Reward calculation inputs:", {
          actual_risk_reward: trade.actual_risk_reward,
          planned_risk_reward: trade.planned_risk_reward,
          entry_price: trade.entry_price,
          exit_price: trade.exit_price,
          stop_loss: trade.stop_loss
        });

        if (trade.actual_risk_reward) {
          console.log("Using actual R/R:", trade.actual_risk_reward);
          tradeDays[dayKey].riskReward = trade.actual_risk_reward;
        } else if (trade.planned_risk_reward && tradeDays[dayKey].riskReward === undefined) {
          console.log("Using planned R/R:", trade.planned_risk_reward);
          tradeDays[dayKey].riskReward = trade.planned_risk_reward;
        } else if (trade.exit_price && trade.entry_price && trade.stop_loss && tradeDays[dayKey].riskReward === undefined) {
          const reward = trade.exit_price - trade.entry_price;
          const risk = Math.abs(trade.entry_price - trade.stop_loss);
          console.log("Calculating R/R from components:", { reward, risk });
          if (risk !== 0) {
            const calculatedRR = reward / risk;
            console.log("Calculated R/R:", calculatedRR);
            tradeDays[dayKey].riskReward = calculatedRR;
          }
        }

        console.log("Final R/R value for day:", tradeDays[dayKey].riskReward);

        // Update options data
        if (trade.vix) tradeDays[dayKey].vix = trade.vix;
        if (trade.call_iv) tradeDays[dayKey].callIv = trade.call_iv;
        if (trade.put_iv) tradeDays[dayKey].putIv = trade.put_iv;
        if (trade.vwap_position) tradeDays[dayKey].vwapPosition = trade.vwap_position;
        if (trade.ema_position) tradeDays[dayKey].emaPosition = trade.ema_position;
        if (trade.option_type) tradeDays[dayKey].option_type = trade.option_type;
        if (trade.trade_direction) tradeDays[dayKey].trade_direction = trade.trade_direction;

        // Update psychology data
        if (trade.market_condition) tradeDays[dayKey].marketCondition = trade.market_condition;
        if (trade.overall_emotional_state) tradeDays[dayKey].emotionalState = trade.overall_emotional_state;
        if (trade.emotional_score) tradeDays[dayKey].emotionalScore = trade.emotional_score;
        if (trade.confidence_level_score) tradeDays[dayKey].confidenceScore = trade.confidence_level_score;
      });

      console.log("Final tradeDays object:", tradeDays);
      return tradeDays;
    },
  });

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
        <div className="bg-background rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly P&L View</h3>
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="pnl"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="bg-background rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Options Data</h3>
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="options"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="bg-background rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Psychology Tracker</h3>
          <CalendarGrid
            days={daysInMonth}
            currentDate={currentDate}
            tradeDays={tradeDays}
            view="psychology"
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
