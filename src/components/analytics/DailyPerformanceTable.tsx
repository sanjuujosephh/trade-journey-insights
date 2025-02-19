
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { cn } from "@/lib/utils";

interface DailyPerformanceTableProps {
  trades: Trade[];
}

export function DailyPerformanceTable({ trades }: DailyPerformanceTableProps) {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(trade);
    return acc;
  }, {});

  // Calculate daily metrics
  const dailyMetrics = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const completedTrades = dayTrades.filter(t => t.exit_price && t.quantity);
    const winningTrades = completedTrades.filter(t => t.outcome === 'profit');
    const netPnL = completedTrades.reduce((sum, trade) => 
      sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!), 0
    );

    // Calculate intraday drawdown
    let maxDrawdown = 0;
    let runningPnL = 0;
    let peakPnL = 0;

    completedTrades
      .sort((a, b) => new Date(a.exit_time!).getTime() - new Date(b.exit_time!).getTime())
      .forEach(trade => {
        runningPnL += (trade.exit_price! - trade.entry_price) * trade.quantity!;
        peakPnL = Math.max(peakPnL, runningPnL);
        const currentDrawdown = peakPnL - runningPnL;
        maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      });

    return {
      date,
      winRate: ((winningTrades.length / completedTrades.length) * 100) || 0,
      totalTrades: completedTrades.length,
      netPnL,
      maxDrawdown
    };
  });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Daily Performance</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead>Total Trades</TableHead>
              <TableHead>Net P/L</TableHead>
              <TableHead>Max Drawdown</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dailyMetrics.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{day.date}</TableCell>
                <TableCell>{day.winRate.toFixed(1)}%</TableCell>
                <TableCell>{day.totalTrades}</TableCell>
                <TableCell className={cn(
                  day.netPnL > 0 ? "text-green-600" : day.netPnL < 0 ? "text-red-600" : ""
                )}>
                  ₹{day.netPnL.toFixed(2)}
                </TableCell>
                <TableCell className="text-red-600">
                  ₹{day.maxDrawdown.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
