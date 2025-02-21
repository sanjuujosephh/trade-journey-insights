
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StreakChartProps {
  trades: Trade[];
}

export function StreakChart({ trades }: StreakChartProps) {
  const data = trades.reduce((acc: { type: string; length: number }[], trade, index) => {
    if (index === 0) {
      return [{ type: trade.outcome, length: 1 }];
    }

    const lastStreak = acc[acc.length - 1];
    if (lastStreak.type === trade.outcome) {
      lastStreak.length += 1;
      return acc;
    }

    acc.push({ type: trade.outcome, length: 1 });
    return acc;
  }, []);

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
