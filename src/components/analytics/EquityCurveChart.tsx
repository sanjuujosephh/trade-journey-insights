
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EquityCurveChartProps {
  trades: Trade[];
}

export function EquityCurveChart({ trades }: EquityCurveChartProps) {
  const data = trades.map(trade => ({
    date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
    balance: trade.exit_price && trade.entry_price 
      ? (trade.exit_price - trade.entry_price) * (trade.quantity || 1)
      : 0
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Equity Curve</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
