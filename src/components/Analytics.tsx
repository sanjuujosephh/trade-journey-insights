
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Trade {
  id: string;
  entry_price: number;
  exit_price: number | null;
  quantity: number | null;
  outcome: "profit" | "loss" | "breakeven";
  strategy: string | null;
  trade_type: string;
  entry_time: string | null;
  timestamp: string;
}

export default function Analytics() {
  const { data: trades = [] } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      return data;
    },
  });

  const calculateStats = () => {
    const completedTrades = trades.filter(trade => trade.exit_price !== null && trade.quantity !== null);
    const totalTrades = completedTrades.length;
    
    if (totalTrades === 0) {
      return {
        winRate: "0%",
        avgProfit: "₹0",
        avgLoss: "₹0",
        riskReward: "0",
      };
    }

    const profitTrades = completedTrades.filter(trade => trade.outcome === "profit");
    const lossTrades = completedTrades.filter(trade => trade.outcome === "loss");

    const winRate = ((profitTrades.length / totalTrades) * 100).toFixed(1);

    const avgProfit = profitTrades.length > 0
      ? (profitTrades.reduce((sum, trade) => {
          if (!trade.exit_price || !trade.quantity) return sum;
          const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
          return sum + pnl;
        }, 0) / profitTrades.length).toFixed(2)
      : "0";

    const avgLoss = lossTrades.length > 0
      ? (lossTrades.reduce((sum, trade) => {
          if (!trade.exit_price || !trade.quantity) return sum;
          const pnl = Math.abs((trade.exit_price - trade.entry_price) * trade.quantity);
          return sum + pnl;
        }, 0) / lossTrades.length).toFixed(2)
      : "0";

    const riskReward = avgLoss !== "0"
      ? (parseFloat(avgProfit) / parseFloat(avgLoss)).toFixed(2)
      : "0";

    return {
      winRate: `${winRate}%`,
      avgProfit: `₹${avgProfit}`,
      avgLoss: `₹${avgLoss}`,
      riskReward,
    };
  };

  const chartData = trades.map(trade => ({
    date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
    pnl: trade.exit_price && trade.quantity
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : 0,
  }));

  const stats = calculateStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 glass">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold">{stats.winRate}</p>
        </Card>
        <Card className="p-4 space-y-2 glass">
          <p className="text-sm text-muted-foreground">Avg Profit</p>
          <p className="text-2xl font-bold">{stats.avgProfit}</p>
        </Card>
        <Card className="p-4 space-y-2 glass">
          <p className="text-sm text-muted-foreground">Avg Loss</p>
          <p className="text-2xl font-bold">{stats.avgLoss}</p>
        </Card>
        <Card className="p-4 space-y-2 glass">
          <p className="text-sm text-muted-foreground">Risk/Reward</p>
          <p className="text-2xl font-bold">{stats.riskReward}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Profit/Loss Over Time</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
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
            {Object.entries(
              trades.reduce((acc: { [key: string]: number }, trade) => {
                if (!trade.strategy || !trade.exit_price || !trade.quantity) return acc;
                const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
                if (!isNaN(pnl)) {
                  acc[trade.strategy] = (acc[trade.strategy] || 0) + pnl;
                }
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([strategy, pnl]) => (
                <div
                  key={strategy}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <span>{strategy}</span>
                  <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
                    ₹{pnl.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trade Distribution</h3>
          <div className="space-y-4">
            {Object.entries(
              trades.reduce((acc: { [key: string]: number }, trade) => {
                acc[trade.trade_type] = (acc[trade.trade_type] || 0) + 1;
                return acc;
              }, {})
            ).map(([type, count]) => {
              const percentage = ((count / trades.length) * 100).toFixed(1);
              return (
                <div
                  key={type}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <span>{type}</span>
                  <span>{percentage}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
