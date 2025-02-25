
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Scatter } from "recharts";
import { parseISO, format as formatDate } from "date-fns";

interface TradeFlowChartProps {
  trades: Trade[];
}

export function TradeFlowChart({ trades }: TradeFlowChartProps) {
  const validTrades = trades.filter(t => t.entry_time && t.exit_time && t.exit_price);
  
  const tradingData = validTrades.map(trade => {
    if (!trade.entry_time) return null;

    // Parse the time from the DD-MM-YYYY HH:mm format
    const [datePart, timePart] = trade.entry_time.split(' ');
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split('-').map(Number);
    const timeStr = timePart.toLowerCase();
    const [hours, minutes] = timeStr.replace(/[ap]m/, '').split(':').map(Number);
    
    let adjustedHours = hours;
    if (timeStr.includes('pm') && hours !== 12) {
      adjustedHours += 12;
    } else if (timeStr.includes('am') && hours === 12) {
      adjustedHours = 0;
    }

    const entryDate = new Date(year, month - 1, day, adjustedHours, minutes);
    
    return {
      time: formatDate(entryDate, 'HH:mm'),
      entryPrice: trade.entry_price,
      exitPrice: trade.exit_price,
      pnl: (trade.exit_price! - trade.entry_price) * (trade.quantity || 1),
      type: trade.trade_type
    };
  }).filter(Boolean).sort((a, b) => {
    const timeA = a!.time.split(':').map(Number);
    const timeB = b!.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

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
                x={trade!.time}
                stroke={trade!.pnl > 0 ? "#10b981" : "#ef4444"}
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

