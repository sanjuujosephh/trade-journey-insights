
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, Cell } from "recharts";
import { format } from "date-fns";

interface TimePerformanceHeatmapProps {
  trades: Trade[];
}

export function TimePerformanceHeatmap({ trades }: TimePerformanceHeatmapProps) {
  const validTrades = trades.filter(t => t.exit_price && t.quantity && t.entry_time);

  const performanceData = validTrades.map(trade => {
    const entryTime = new Date(trade.entry_time!);
    const date = format(entryTime, 'yyyy-MM-dd');
    const hour = entryTime.getHours();
    const minutes = entryTime.getMinutes();
    const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
    
    return {
      date,
      time,
      pnl,
      hour: hour + minutes / 60 // Convert to decimal hours for y-axis
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Time Performance Heatmap</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
          >
            <XAxis
              dataKey="date"
              type="category"
              name="Date"
              tick={{ fontSize: 11, fill: '#6b7280', textAnchor: 'end' }}
              tickLine={{ stroke: '#9ca3af' }}
              interval={0}
            />
            <YAxis
              dataKey="hour"
              type="number"
              name="Time"
              domain={[9, 15.5]}
              tickFormatter={(value) => {
                const hours = Math.floor(value);
                const minutes = Math.round((value - hours) * 60);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              }}
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
              formatter={(value: any, name: string, props: any) => {
                if (name === "Time") {
                  const hours = Math.floor(value);
                  const minutes = Math.round((value - hours) * 60);
                  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }
                if (name === "P&L") return `₹${props.payload.pnl.toFixed(2)}`;
                return value;
              }}
              labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
            />
            <Scatter data={performanceData} shape="circle">
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl > 0 ? "#10B981" : "#EF4444"}
                  opacity={0.7}
                  r={10}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Circle color represents P/L (green for profit, red for loss)
      </div>
    </Card>
  );
}
