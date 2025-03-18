
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface StrategyPerformanceProps {
  trades: Trade[];
}

export function StrategyPerformance({ trades }: StrategyPerformanceProps) {
  // Group trades by strategy
  const strategyMap = new Map<string, { wins: number; losses: number; totalPnL: number; trades: number }>();
  
  trades.forEach(trade => {
    const strategy = trade.strategy || "Unknown";
    
    if (!strategyMap.has(strategy)) {
      strategyMap.set(strategy, { wins: 0, losses: 0, totalPnL: 0, trades: 0 });
    }
    
    const stats = strategyMap.get(strategy)!;
    stats.trades += 1;
    
    if (trade.outcome === 'profit') {
      stats.wins += 1;
    } else if (trade.outcome === 'loss') {
      stats.losses += 1;
    }
    
    stats.totalPnL += calculateTradePnL(trade);
  });
  
  // Convert to array for chart
  const strategyData = Array.from(strategyMap.entries()).map(([strategy, stats]) => ({
    name: strategy,
    winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
    pnl: stats.totalPnL,
    trades: stats.trades
  }));
  
  // Sort by number of trades descending
  strategyData.sort((a, b) => b.trades - a.trades);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Strategy Performance</h3>
      
      {strategyData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No strategy data available
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={strategyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value, name) => [
                  name === 'winRate' ? `${value.toFixed(1)}%` : `₹${value.toFixed(2)}`,
                  name === 'winRate' ? 'Win Rate' : 'P&L'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="pnl" name="P&L (₹)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {strategyData.slice(0, 4).map((strategy) => (
              <Card key={strategy.name} className="p-3">
                <div className="text-sm font-medium truncate">{strategy.name}</div>
                <div className="mt-1 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Win Rate: <span className="font-semibold">{strategy.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    P&L: <span className={`font-semibold ${strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{strategy.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Trades: <span className="font-semibold">{strategy.trades}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
