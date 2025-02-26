
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { TradeDay } from "@/components/analytics/calendar/calendarUtils";

export function useTradeDays(currentDate: Date) {
  return useQuery({
    queryKey: ["calendar-trades", dayjs(currentDate).format("YYYY-MM")],
    queryFn: async () => {
      // Create dates for first and last day of the month using dayjs
      const monthStart = dayjs(currentDate).startOf('month');
      const monthEnd = dayjs(currentDate).endOf('month');

      // Format dates as DD-MM-YYYY to match database format
      const startDate = monthStart.format('DD-MM-YYYY');
      const endDate = monthEnd.format('DD-MM-YYYY');

      console.log("Fetching trades between:", {
        monthStart: startDate,
        monthEnd: endDate
      });

      const { data: trades, error } = await supabase
        .from("trades")
        .select("*")
        .gte("entry_date", startDate)
        .lte("entry_date", endDate)
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
        
        // Convert DD-MM-YYYY to YYYY-MM-DD for internal calendar use
        const dateParts = trade.entry_date.split('-');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
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
