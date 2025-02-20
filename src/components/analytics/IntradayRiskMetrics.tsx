
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";

interface IntradayRiskMetricsProps {
  trades: Trade[];
}

export function IntradayRiskMetrics({ trades }: IntradayRiskMetricsProps) {
  const validTrades = trades.filter(t => t.exit_price && t.quantity);
  
  // Calculate max loss per trade
  const tradesWithPnL = validTrades.map(trade => ({
    ...trade,
    pnl: (trade.exit_price! - trade.entry_price) * trade.quantity!
  }));

  const maxLossTrade = tradesWithPnL.reduce((prev, curr) => 
    curr.pnl < prev.pnl ? curr : prev
  , tradesWithPnL[0]);

  const maxGainTrade = tradesWithPnL.reduce((prev, curr) => 
    curr.pnl > prev.pnl ? curr : prev
  , tradesWithPnL[0]);

  // Group by date for daily metrics
  const tradesByDate = validTrades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(trade);
    return acc;
  }, {});

  // Calculate max loss per day
  const dailyMaxLoss = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades.reduce((sum, trade) => 
      sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!), 0
    );
    return { date, loss: dailyPnL };
  }).reduce((prev, curr) => 
    curr.loss < prev.loss ? curr : prev
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Biggest Winners & Losers</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Biggest Winning Trade</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{maxGainTrade?.pnl.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              at {new Date(maxGainTrade?.entry_time || "").toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Biggest Losing Trade</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{maxLossTrade?.pnl.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              at {new Date(maxLossTrade?.entry_time || "").toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Daily Risk Metrics</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Worst Trading Day</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{dailyMaxLoss?.loss.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              on {dailyMaxLoss?.date}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Average Trade Duration</p>
            <p className="text-3xl font-bold">
              {Math.round(validTrades.reduce((sum, trade) => {
                const duration = new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime();
                return sum + duration;
              }, 0) / (validTrades.length * 60000))} min
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
