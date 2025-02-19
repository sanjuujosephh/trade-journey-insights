
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

interface DrawdownChartProps {
  data: { date: string; drawdown: number }[];
}

export function DrawdownChart({ data }: DrawdownChartProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Drawdown Analysis</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
