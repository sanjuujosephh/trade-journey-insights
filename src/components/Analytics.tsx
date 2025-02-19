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
  Area,
  AreaChart,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      if (error) throw error;
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

  // Calculate equity curve data
  const equityCurveData = trades.reduce((acc: any[], trade) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    if (trade.exit_price && trade.quantity) {
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      acc.push({
        date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
        balance: lastBalance + pnl
      });
    }
    return acc;
  }, []);

  // Calculate drawdown data
  const calculateDrawdowns = () => {
    let peak = 0;
    let drawdowns = [];
    let balance = 0;

    for (const trade of trades) {
      if (!trade.exit_price || !trade.quantity) continue;
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      balance += pnl;
      
      if (balance > peak) {
        peak = balance;
      }
      
      const drawdown = ((peak - balance) / peak) * 100;
      drawdowns.push({
        date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
        drawdown: drawdown
      });
    }
    return drawdowns;
  };

  // Calculate winning/losing streaks
  const calculateStreaks = () => {
    let currentStreak = 0;
    const streaks = [];
    
    for (let i = 0; i < trades.length; i++) {
      if (trades[i].outcome === trades[i-1]?.outcome) {
        currentStreak++;
      } else {
        if (currentStreak > 0) {
          streaks.push({
            type: trades[i-1].outcome,
            length: currentStreak
          });
        }
        currentStreak = 1;
      }
    }
    
    if (currentStreak > 0) {
      streaks.push({
        type: trades[trades.length - 1].outcome,
        length: currentStreak
      });
    }

    return streaks;
  };

  // Calculate trade duration statistics
  const calculateTradeDurationStats = () => {
    const durationData = trades
      .filter(t => t.entry_time && t.exit_time)
      .map(trade => {
        const duration = new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime();
        return {
          duration: duration / (1000 * 60), // Convert to minutes
          pnl: trade.exit_price && trade.quantity ? 
            (trade.exit_price - trade.entry_price) * trade.quantity : 0
        };
      });

    return durationData.reduce((acc: any[], data) => {
      const durationRange = Math.floor(data.duration / 30) * 30; // Group by 30-minute intervals
      const existing = acc.find(item => item.duration === durationRange);
      
      if (existing) {
        existing.trades++;
        existing.avgPnL = (existing.avgPnL * (existing.trades - 1) + data.pnl) / existing.trades;
      } else {
        acc.push({
          duration: durationRange,
          trades: 1,
          avgPnL: data.pnl
        });
      }
      
      return acc;
    }, []).sort((a: any, b: any) => a.duration - b.duration);
  };

  const stats = calculateStats();
  const drawdowns = calculateDrawdowns();
  const streaks = calculateStreaks();
  const durationStats = calculateTradeDurationStats();

  return (
    <div className="h-full p-6">
      <Tabs defaultValue="performance" className="h-full">
        <TabsList>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Trading Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="h-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Equity Curve</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityCurveData}>
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

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Drawdown Analysis</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={drawdowns}>
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
          </div>
        </TabsContent>

        <TabsContent value="risk" className="h-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Sharpe Ratio</h3>
              <p className="text-3xl font-bold">
                {calculateSharpeRatio(trades
                  .filter(t => t.exit_price && t.quantity)
                  .map(t => ((t.exit_price! - t.entry_price) * t.quantity!) / t.entry_price)
                ).toFixed(2)}
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Trade Expectancy</h3>
              <p className="text-3xl font-bold">₹{calculateExpectancy(trades).toFixed(2)}</p>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-2">Max Drawdown</h3>
              <p className="text-3xl font-bold">{Math.max(...drawdowns.map(d => d.drawdown)).toFixed(2)}%</p>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Trade Duration Analysis</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duration" label={{ value: 'Duration (minutes)', position: 'bottom' }} />
                  <YAxis label={{ value: 'Average P/L', angle: -90, position: 'left' }} />
                  <Tooltip />
                  <Bar dataKey="avgPnL" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="h-full space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Win/Loss Streaks</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={streaks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="length" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="length"
                    fill={(entry) => entry.type === 'profit' ? '#10B981' : '#EF4444'}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
