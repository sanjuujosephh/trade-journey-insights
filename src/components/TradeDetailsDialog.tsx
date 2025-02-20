import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trade } from "@/types/trade";

interface TradeDetailsDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsDialog({ trade, open, onOpenChange }: TradeDetailsDialogProps) {
  if (!trade) return null;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const calculatePnL = () => {
    if (!trade.exit_price || !trade.quantity) return null;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
    return pnl.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Trade Details - {trade.symbol}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Entry Details</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <p>₹{trade.entry_price}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <p>{trade.entry_time ? formatDateTime(trade.entry_time) : 'N/A'}</p>
                </div>
                {trade.strike_price && (
                  <div>
                    <span className="text-sm text-muted-foreground">Strike Price:</span>
                    <p>₹{trade.strike_price}</p>
                  </div>
                )}
                {trade.option_type && (
                  <div>
                    <span className="text-sm text-muted-foreground">Option Type:</span>
                    <p className="capitalize">{trade.option_type}</p>
                  </div>
                )}
                {trade.entry_emotion && (
                  <div>
                    <span className="text-sm text-muted-foreground">Entry Emotion:</span>
                    <p className="capitalize">{trade.entry_emotion}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Link */}
            {trade.chart_link && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium">Chart</h4>
                <a
                  href={trade.chart_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  View TradingView Chart
                </a>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium">Exit Details</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <p>{trade.exit_price ? `₹${trade.exit_price}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Time:</span>
                  <p>{trade.exit_time ? formatDateTime(trade.exit_time) : 'N/A'}</p>
                </div>
                {trade.exit_reason && (
                  <div>
                    <span className="text-sm text-muted-foreground">Exit Reason:</span>
                    <p className="capitalize">{trade.exit_reason.replace('_', ' ')}</p>
                  </div>
                )}
                {trade.exit_emotion && (
                  <div>
                    <span className="text-sm text-muted-foreground">Exit Emotion:</span>
                    <p className="capitalize">{trade.exit_emotion}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Trade Context</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Market Condition:</span>
                  <p className="capitalize">{trade.market_condition?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Timeframe:</span>
                  <p>{trade.timeframe || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Direction:</span>
                  <p className="capitalize">{trade.trade_direction || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Confidence Level:</span>
                  <p>{trade.confidence_level ? `${trade.confidence_level}/5` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Risk Management</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Stop Loss:</span>
                  <p>{trade.stop_loss ? `₹${trade.stop_loss}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Target:</span>
                  <p>{trade.planned_target ? `₹${trade.planned_target}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Risk/Reward:</span>
                  <p>{trade.planned_risk_reward ? `${trade.planned_risk_reward}:1` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Actual R/R:</span>
                  <p>{trade.actual_risk_reward ? `${trade.actual_risk_reward}:1` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="col-span-2">
              <h4 className="text-sm font-medium">Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
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
                  <p className="text-red-600">{trade.slippage ? `₹${trade.slippage}` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Exit Efficiency:</span>
                  <p>{trade.exit_efficiency ? `${(trade.exit_efficiency * 100).toFixed(1)}%` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Behavioral Analysis */}
            <div className="col-span-2">
              <h4 className="text-sm font-medium">Behavioral Analysis</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Followed Plan:</span>
                  <p>{trade.followed_plan ? 'Yes' : 'No'}</p>
                </div>
                {!trade.followed_plan && trade.plan_deviation_reason && (
                  <div>
                    <span className="text-sm text-muted-foreground">Deviation Reason:</span>
                    <p>{trade.plan_deviation_reason}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">FOMO Trade:</span>
                    <p>{trade.is_fomo_trade ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Impulsive Exit:</span>
                    <p>{trade.is_impulsive_exit ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            {trade.ai_feedback && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium">AI Feedback</h4>
                <p className="mt-2 text-sm whitespace-pre-wrap">{trade.ai_feedback}</p>
              </div>
            )}

            {/* Notes */}
            {trade.notes && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="mt-2 text-sm whitespace-pre-wrap">{trade.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
