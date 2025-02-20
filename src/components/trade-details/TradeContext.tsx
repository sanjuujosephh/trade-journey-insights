
import { Trade } from "@/types/trade";

interface TradeContextProps {
  trade: Trade;
}

export function TradeContext({ trade }: TradeContextProps) {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Trade Context</h4>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-muted-foreground">Market Condition:</span>
          <p className="font-medium capitalize">{trade.market_condition?.replace('_', ' ') || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Timeframe:</span>
          <p className="font-medium">{trade.timeframe || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Direction:</span>
          <p className="font-medium capitalize">{trade.trade_direction || 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Confidence Level:</span>
          <p className="font-medium">{trade.confidence_level ? `${trade.confidence_level}/5` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
