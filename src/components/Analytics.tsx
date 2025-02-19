
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade } from "@/types/trade";
import { EquityCurveChart } from "./analytics/EquityCurveChart";
import { DrawdownChart } from "./analytics/DrawdownChart";
import { StreakChart } from "./analytics/StreakChart";
import {
  calculateStats,
  calculateEquityCurve,
  calculateDrawdowns,
  calculateStreaks,
  calculateSharpeRatio,
  calculateExpectancy,
  calculateTradeDurationStats,
} from "@/utils/tradeCalculations";
import { Cell } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const { data: trades = [] } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const stats = calculateStats(trades);
  const equityCurveData = calculateEquityCurve(trades);
  const drawdowns = calculateDrawdowns(trades);
  const streaks = calculateStreaks(trades);
  const durationStats = calculateTradeDurationStats(trades);

  return (
    <div className="h-full p-6">
      <Tabs defaultValue="performance" className="h-full">
        <TabsList>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Trading Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="h-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{stats.winRate}</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Avg Profit</p>
              <p className="text-2xl font-bold">{stats.avgProfit}</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Avg Loss</p>
              <p className="text-2xl font-bold">{stats.avgLoss}</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Risk/Reward</p>
              <p className="text-2xl font-bold">{stats.riskReward}</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Max Drawdown</p>
              <p className="text-2xl font-bold">{stats.maxDrawdown}</p>
            </Card>
            <Card className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Consistency Score</p>
              <p className="text-2xl font-bold">{stats.consistencyScore}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EquityCurveChart data={equityCurveData} />
            <DrawdownChart data={drawdowns} />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="h-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Sharpe Ratio</h3>
              <p className="text-3xl font-bold">
                {calculateSharpeRatio(trades
                  .filter(t => t.exit_price && t.quantity)
                  .map(t => ((t.exit_price! - t.entry_price) * t.quantity!) / t.entry_price)
                ).toFixed(2)}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Trade Expectancy</h3>
              <p className="text-3xl font-bold">₹{calculateExpectancy(trades).toFixed(2)}</p>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Max Drawdown</h3>
              <p className="text-3xl font-bold">{stats.maxDrawdown}</p>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Trade Duration Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duration" label={{ value: 'Duration (minutes)', position: 'bottom' }} />
                  <YAxis label={{ value: 'Average P/L', angle: -90, position: 'left' }} />
                  <Tooltip />
                  <Bar dataKey="avgPnL" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="h-full space-y-4">
          <StreakChart data={streaks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
