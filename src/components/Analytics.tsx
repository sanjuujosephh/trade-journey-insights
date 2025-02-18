
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data - replace with real data later
const data = [
  { date: "Jan", pnl: 4000 },
  { date: "Feb", pnl: -2000 },
  { date: "Mar", pnl: 6000 },
  { date: "Apr", pnl: 8000 },
  { date: "May", pnl: -3000 },
  { date: "Jun", pnl: 10000 },
];

const stats = [
  { label: "Win Rate", value: "65%", trend: "up" },
  { label: "Avg Profit", value: "₹2,450", trend: "up" },
  { label: "Avg Loss", value: "₹1,200", trend: "down" },
  { label: "Risk/Reward", value: "2.04", trend: "neutral" },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Profit/Loss Over Time</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#3B82F6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Performing Strategies</h3>
          <div className="space-y-4">
            {["Breakout", "Reversal", "Gap Fill"].map((strategy) => (
              <div
                key={strategy}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <span>{strategy}</span>
                <span className="text-success-DEFAULT">+65%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trade Distribution</h3>
          <div className="space-y-4">
            {["Intraday", "Swing", "Options"].map((type) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <span>{type}</span>
                <span>45%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
