
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Scatter } from "recharts";
import { format } from "date-fns";

interface TradeFlowChartProps {
  trades: Trade[];
}

export function TradeFlowChart({ trades }: TradeFlowChartProps) {
  const validTrades = trades.filter(t => t.entry_time && t.exit_time && t.exit_price);
  
  const tradingData = validTrades.map(trade => {
    const entryTime = new Date(trade.entry_time!);
    const exitTime = new Date(trade.exit_time!);
    const pnl = (trade.exit_price! - trade.entry_price) * (trade.quantity || 1);
    
    return {
      time: format(entryTime, 'HH:mm'),
      entryPrice: trade.entry_price,
      exitPrice: trade.exit_price,
      pnl,
      type: trade.trade_type
    };
  }).sort((a, b) => new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime());

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Intraday Trade Flow</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tradingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#9ca3af' }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={{ stroke: '#9ca3af' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Line
              type="stepAfter"
              dataKey="entryPrice"
              stroke="#2563eb"
              dot={{ r: 4, fill: "#2563eb" }}
              name="Entry Price"
              strokeWidth={1.5}
            />
            <Line
              type="stepAfter"
              dataKey="exitPrice"
              stroke="#10b981"
              dot={{ r: 4, fill: "#10b981" }}
              name="Exit Price"
              strokeWidth={1.5}
            />
            {tradingData.map((trade, index) => (
              <ReferenceLine
                key={index}
                x={trade.time}
                stroke={trade.pnl > 0 ? "#10b981" : "#ef4444"}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
