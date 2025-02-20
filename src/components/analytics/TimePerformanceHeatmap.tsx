
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, Cell } from "recharts";

interface TimePerformanceHeatmapProps {
  trades: Trade[];
}

export function TimePerformanceHeatmap({ trades }: TimePerformanceHeatmapProps) {
  const timeSlots = Array.from({ length: 7 }, (_, i) => 9 + i);
  const validTrades = trades.filter(t => t.exit_price && t.quantity && t.entry_time);

  const performanceData = validTrades.map(trade => {
    const entryTime = new Date(trade.entry_time!);
    const hour = entryTime.getHours();
    const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
    return { hour, pnl };
  });

  const hourlyPerformance = timeSlots.map(hour => {
    const hourTrades = performanceData.filter(d => d.hour === hour);
    const totalPnL = hourTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winRate = hourTrades.filter(t => t.pnl > 0).length / hourTrades.length;
    
    return {
      hour,
      pnl: totalPnL,
      trades: hourTrades.length,
      winRate: winRate || 0
    };
  });

  const maxPnL = Math.max(...hourlyPerformance.map(h => Math.abs(h.pnl)));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Time Performance Heatmap</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
          >
            <XAxis
              type="number"
              dataKey="hour"
              name="Hour"
              domain={[9, 15]}
              tickFormatter={(hour) => `${hour}:00`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <YAxis
              type="number"
              dataKey="winRate"
              name="Win Rate"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100)}%`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{ 
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any, name: string) => {
                if (name === "Win Rate") return `${(Number(value) * 100).toFixed(1)}%`;
                return value;
              }}
            />
            <Scatter data={hourlyPerformance} shape="circle">
              {hourlyPerformance.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl > 0 ? "#10B981" : "#EF4444"}
                  opacity={Math.abs(entry.pnl) / maxPnL}
                  r={Math.max(20 * (entry.trades / Math.max(...hourlyPerformance.map(h => h.trades))), 5)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Circle size represents number of trades, color intensity represents P/L magnitude
      </div>
    </Card>
  );
}
