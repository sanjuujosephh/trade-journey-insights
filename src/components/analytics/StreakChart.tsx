
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StreakChartProps {
  data: { type: string; length: number }[];
}

export function StreakChart({ data }: StreakChartProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Win/Loss Streaks</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="length" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="length"
              name="Streak Length"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.type === 'profit' ? '#10B981' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
