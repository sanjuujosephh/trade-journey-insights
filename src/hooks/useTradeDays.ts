
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { TradeDay } from "@/components/analytics/calendar/calendarUtils";

const formatToIST = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
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
        
        if (!tradeDays[trade.entry_date]) {
          tradeDays[trade.entry_date] = {
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
          tradeDays[trade.entry_date].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
        }
        tradeDays[trade.entry_date].tradeCount += 1;

        if (trade.actual_risk_reward !== null && trade.actual_risk_reward !== undefined) {
          tradeDays[trade.entry_date].riskReward = Number(trade.actual_risk_reward);
        } else if (
          trade.planned_risk_reward !== null && 
          trade.planned_risk_reward !== undefined && 
          tradeDays[trade.entry_date].riskReward === undefined
        ) {
          tradeDays[trade.entry_date].riskReward = Number(trade.planned_risk_reward);
        } else if (
          trade.exit_price && 
          trade.entry_price && 
          trade.stop_loss && 
          tradeDays[trade.entry_date].riskReward === undefined
        ) {
          const reward = Number(trade.exit_price) - Number(trade.entry_price);
          const risk = Math.abs(Number(trade.entry_price) - Number(trade.stop_loss));
          if (risk !== 0) {
            tradeDays[trade.entry_date].riskReward = Number((reward / risk).toFixed(2));
          }
        }

        if (trade.vix) tradeDays[trade.entry_date].vix = trade.vix;
        if (trade.call_iv) tradeDays[trade.entry_date].callIv = trade.call_iv;
        if (trade.put_iv) tradeDays[trade.entry_date].putIv = trade.put_iv;
        if (trade.vwap_position) tradeDays[trade.entry_date].vwapPosition = trade.vwap_position;
        if (trade.ema_position) tradeDays[trade.entry_date].emaPosition = trade.ema_position;
        if (trade.option_type) tradeDays[trade.entry_date].option_type = trade.option_type;
        if (trade.trade_direction) tradeDays[trade.entry_date].trade_direction = trade.trade_direction;
      });

      console.log("Final tradeDays object:", tradeDays);
      return tradeDays;
    },
  });
}
