
import { Card } from "@/components/ui/card";
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
  data: { date: string; balance: number }[];
}

export function EquityCurveChart({ data }: EquityCurveChartProps) {
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
