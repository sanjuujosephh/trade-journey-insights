import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Trade {
  id: string;
  entry_price: number;
  exit_price?: number | null;
  quantity?: number | null;
  outcome: 'profit' | 'loss' | 'breakeven';
  strategy?: string | null;
  trade_type: string;
  entry_time?: string | null;
  exit_time?: string | null;
  timestamp: string;
  stop_loss?: number | null;
  symbol: string;
  notes?: string | null;
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
        maxDrawdown: "0%",
        consistencyScore: "0%",
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

    const maxDrawdown = calculateMaxDrawdown(completedTrades);

    const consistencyScore = calculateConsistencyScore(completedTrades);

    return {
      winRate: `${winRate}%`,
      avgProfit: `₹${avgProfit}`,
      avgLoss: `₹${avgLoss}`,
      riskReward,
      maxDrawdown: `${maxDrawdown}%`,
      consistencyScore: `${consistencyScore}%`,
    };
  };

  const calculateMaxDrawdown = (trades: Trade[]) => {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    trades.forEach(trade => {
      if (!trade.exit_price || !trade.quantity) return;
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      runningPnL += pnl;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      
      const drawdown = ((peak - runningPnL) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return maxDrawdown.toFixed(1);
  };

  const calculateConsistencyScore = (trades: Trade[]) => {
    let score = 100;
    
    const tradesWithoutStopLoss = trades.filter(t => !t.stop_loss).length;
    score -= (tradesWithoutStopLoss / trades.length) * 30;

    const overtradingDays = new Set(
      trades.filter(t => {
        const dayTrades = trades.filter(trade => 
          new Date(trade.timestamp).toDateString() === new Date(t.timestamp).toDateString()
        );
        return dayTrades.length > 2;
      }).map(t => new Date(t.timestamp).toDateString())
    ).size;
    score -= (overtradingDays / Math.ceil(trades.length / 2)) * 20;

    return Math.max(0, Math.min(100, score)).toFixed(1);
  };

  const chartData = trades
    .sort((a, b) => {
      const dateA = new Date(a.entry_time || a.timestamp).getTime();
      const dateB = new Date(b.entry_time || b.timestamp).getTime();
      return dateA - dateB;
    })
    .map(trade => ({
      date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
      pnl: trade.exit_price && trade.quantity
        ? (trade.exit_price - trade.entry_price) * trade.quantity
        : 0,
    }));

  interface StrategyPerformance {
    name: string;
    winRate: string;
    pnl: string;
  }

  const strategyPerformance: StrategyPerformance[] = Object.entries(
    trades.reduce<Record<string, { wins: number; losses: number; pnl: number }>>((acc, trade) => {
      const strategy = trade.strategy || 'Unspecified';
      if (!acc[strategy]) {
        acc[strategy] = { wins: 0, losses: 0, pnl: 0 };
      }
      
      if (trade.outcome === 'profit') {
        acc[strategy].wins++;
      } else if (trade.outcome === 'loss') {
        acc[strategy].losses++;
      }

      if (trade.exit_price && trade.quantity) {
        acc[strategy].pnl += (trade.exit_price - trade.entry_price) * trade.quantity;
      }

      return acc;
    }, {})
  ).map(([strategy, data]) => ({
    name: strategy,
    winRate: data.wins + data.losses > 0 
      ? ((data.wins / (data.wins + data.losses)) * 100).toFixed(1)
      : '0',
    pnl: data.pnl.toFixed(2),
  }));

  const timeAnalysis = trades.reduce((acc: { [key: string]: number }, trade) => {
    if (!trade.entry_time) return acc;
    const hour = new Date(trade.entry_time).getHours();
    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
    
    if (!acc[timeSlot]) {
      acc[timeSlot] = 0;
    }

    if (trade.exit_price && trade.quantity) {
      acc[timeSlot] += (trade.exit_price - trade.entry_price) * trade.quantity;
    }

    return acc;
  }, {});

  const timePerformanceData = Object.entries(timeAnalysis)
    .map(([time, pnl]) => ({
      time,
      pnl: Number(pnl.toFixed(2)),
    }))
    .sort((a, b) => {
      const timeA = parseInt(a.time.split(':')[0]);
      const timeB = parseInt(b.time.split(':')[0]);
      return timeA - timeB;
    });

  const stats = calculateStats();

  const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

  return (
    <div className="h-full">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
          <Card className="p-4 space-y-2 glass">
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-2xl font-bold">{stats.maxDrawdown}</p>
          </Card>
          <Card className="p-4 space-y-2 glass">
            <p className="text-sm text-muted-foreground">Consistency Score</p>
            <p className="text-2xl font-bold">{stats.consistencyScore}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">P/L Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Strategy Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="winRate" fill="#3B82F6" name="Win Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Time-Based Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pnl" fill="#10B981" name="P/L" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Performing Strategies</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={strategyPerformance.filter(s => parseFloat(s.pnl) > 0)}
                    dataKey="pnl"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {strategyPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
