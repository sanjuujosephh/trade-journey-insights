
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { TradeDay } from "@/components/analytics/calendar/calendarUtils";

const formatToIST = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const parts = new Intl.DateTimeFormat('en-IN', options).formatToParts(date);
  const values: { [key: string]: string } = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
};

export function useTradeDays(currentDate: Date) {
  return useQuery({
    queryKey: ["calendar-trades", format(currentDate, "yyyy-MM")],
    queryFn: async () => {
      const monthStart = new Date(currentDate);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(currentDate);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      console.log("Fetching trades for:", {
        monthStart: formatToIST(monthStart),
        monthEnd: formatToIST(monthEnd)
      });

      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .gte("entry_time", formatToIST(monthStart))
        .lte("entry_time", formatToIST(monthEnd))
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
        
        if (trade.exit_price && trade.entry_price && trade.quantity) {
          tradeDays[dayKey].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
        }
        tradeDays[dayKey].tradeCount += 1;

        if (trade.actual_risk_reward !== null && trade.actual_risk_reward !== undefined) {
          tradeDays[dayKey].riskReward = Number(trade.actual_risk_reward);
        } else if (
          trade.planned_risk_reward !== null && 
          trade.planned_risk_reward !== undefined && 
          tradeDays[dayKey].riskReward === undefined
        ) {
          tradeDays[dayKey].riskReward = Number(trade.planned_risk_reward);
        } else if (
          trade.exit_price && 
          trade.entry_price && 
          trade.stop_loss && 
          tradeDays[dayKey].riskReward === undefined
        ) {
          const reward = Number(trade.exit_price) - Number(trade.entry_price);
          const risk = Math.abs(Number(trade.entry_price) - Number(trade.stop_loss));
          if (risk !== 0) {
            tradeDays[dayKey].riskReward = Number((reward / risk).toFixed(2));
          }
        }

        if (trade.vix) tradeDays[dayKey].vix = trade.vix;
        if (trade.call_iv) tradeDays[dayKey].callIv = trade.call_iv;
        if (trade.put_iv) tradeDays[dayKey].putIv = trade.put_iv;
        if (trade.vwap_position) tradeDays[dayKey].vwapPosition = trade.vwap_position;
        if (trade.ema_position) tradeDays[dayKey].emaPosition = trade.ema_position;
        if (trade.option_type) tradeDays[dayKey].option_type = trade.option_type;
        if (trade.trade_direction) tradeDays[dayKey].trade_direction = trade.trade_direction;
      });

      console.log("Final tradeDays object:", tradeDays);
      return tradeDays;
    },
  });
}
