
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";

interface IntradayRiskMetricsProps {
  trades: Trade[];
}

export function IntradayRiskMetrics({ trades }: IntradayRiskMetricsProps) {
  // Calculate risk metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(trade => trade.outcome === 'profit').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Intraday Risk Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold">{winRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Trades</p>
          <p className="text-2xl font-bold">{totalTrades}</p>
        </div>
      </div>
    </Card>
  );
}
