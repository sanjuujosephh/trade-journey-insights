
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { TradeDay } from "@/components/analytics/calendar/calendarUtils";

const formatToIST = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useTradeDays(currentDate: Date) {
  return useQuery({
    queryKey: ["calendar-trades", format(currentDate, "yyyy-MM")],
    queryFn: async () => {
      // Create dates for first and last day of the month
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      console.log("Fetching trades for:", {
        monthStart: formatToIST(monthStart),
        monthEnd: formatToIST(monthEnd)
      });

      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .gte("entry_date", formatToIST(monthStart))
        .lte("entry_date", formatToIST(monthEnd))
        .order("entry_time");
      
      if (error) {
        console.error("Supabase query error:", error);
        return {};
      }

      console.log("Received trades:", trades);

      if (!trades) return {};

      const tradeDays: TradeDay = {};
      
      trades.forEach((trade) => {
        if (!trade.entry_date) {
          console.log("Trade missing entry_date:", trade);
          return;
        }
        
        const formattedDate = trade.entry_date;
        
        if (!tradeDays[formattedDate]) {
          tradeDays[formattedDate] = {
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
          tradeDays[formattedDate].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
        }
        tradeDays[formattedDate].tradeCount += 1;
        
        if (trade.actual_risk_reward !== null && trade.actual_risk_reward !== undefined) {
          tradeDays[formattedDate].riskReward = Number(trade.actual_risk_reward);
        } else if (trade.planned_risk_reward !== null && trade.planned_risk_reward !== undefined) {
          tradeDays[formattedDate].riskReward = Number(trade.planned_risk_reward);
        }
      });

      return tradeDays;
    },
    refetchOnWindowFocus: false,
  });
}
