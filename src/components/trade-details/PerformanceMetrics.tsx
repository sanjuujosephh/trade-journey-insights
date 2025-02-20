
import { Trade } from "@/types/trade";

interface PerformanceMetricsProps {
  trade: Trade;
}

export function PerformanceMetrics({ trade }: PerformanceMetricsProps) {
  const calculatePnL = () => {
    if (!trade.exit_price || !trade.quantity) return null;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
    return pnl.toFixed(2);
  };

  return (
    <div className="col-span-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Performance Metrics</h4>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <span className="text-sm text-muted-foreground">P/L:</span>
          <p className={`font-medium ${
            calculatePnL() && parseFloat(calculatePnL()!) > 0 ? "text-green-600" : "text-red-600"
          }`}>
            {calculatePnL() ? `₹${calculatePnL()}` : 'N/A'}
          </p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Slippage:</span>
          <p className="font-medium text-red-600">{trade.slippage ? `₹${trade.slippage}` : 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Exit Efficiency:</span>
          <p className="font-medium">{trade.exit_efficiency ? `${(trade.exit_efficiency * 100).toFixed(1)}%` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
