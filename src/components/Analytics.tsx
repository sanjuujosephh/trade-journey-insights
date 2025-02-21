
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PerformanceMetrics } from "./analytics/PerformanceMetrics";
import { DailyPerformanceTable } from "./analytics/DailyPerformanceTable";
import { EquityCurveChart } from "./analytics/EquityCurveChart";
import { DrawdownChart } from "./analytics/DrawdownChart";
import { TimePerformanceHeatmap } from "./analytics/TimePerformanceHeatmap";
import { StreakChart } from "./analytics/StreakChart";
import { Card } from "./ui/card";
import { IntradayRiskMetrics } from "./analytics/IntradayRiskMetrics";
import { FOTradeTable } from "./analytics/FOTradeTable";
import { TradingCalendar } from "./analytics/TradingCalendar";
import { Trade } from "@/types/trade";

interface AnalyticsProps {
  trades: Trade[];
}

export function Analytics({ trades }: AnalyticsProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <PerformanceMetrics trades={trades} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityCurveChart trades={trades} />
        <DrawdownChart trades={trades} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimePerformanceHeatmap trades={trades} />
        <StreakChart trades={trades} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntradayRiskMetrics trades={trades} />
        <TradingCalendar />
      </div>

      <DailyPerformanceTable trades={trades} />
      <FOTradeTable trades={trades} />
    </div>
  );
}
