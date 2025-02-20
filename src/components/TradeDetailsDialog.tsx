
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
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Trade Details - {trade.symbol}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Chart Link - Moved to top */}
            {trade.chart_link && (
              <div className="w-full bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-2">Chart</h4>
                <a
                  href={trade.chart_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm inline-flex items-center gap-2"
                >
                  View TradingView Chart
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entry Details */}
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">Entry Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <p className="font-medium">₹{trade.entry_price}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <p className="font-medium">{trade.entry_time ? formatDateTime(trade.entry_time) : 'N/A'}</p>
                  </div>
                  {trade.strike_price && (
                    <div>
                      <span className="text-sm text-muted-foreground">Strike Price:</span>
                      <p className="font-medium">₹{trade.strike_price}</p>
                    </div>
                  )}
                  {trade.option_type && (
                    <div>
                      <span className="text-sm text-muted-foreground">Option Type:</span>
                      <p className="font-medium capitalize">{trade.option_type}</p>
                    </div>
                  )}
                  {trade.entry_emotion && (
                    <div>
                      <span className="text-sm text-muted-foreground">Entry Emotion:</span>
                      <p className="font-medium capitalize">{trade.entry_emotion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Exit Details */}
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">Exit Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <p className="font-medium">{trade.exit_price ? `₹${trade.exit_price}` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <p className="font-medium">{trade.exit_time ? formatDateTime(trade.exit_time) : 'N/A'}</p>
                  </div>
                  {trade.exit_reason && (
                    <div>
                      <span className="text-sm text-muted-foreground">Exit Reason:</span>
                      <p className="font-medium capitalize">{trade.exit_reason.replace('_', ' ')}</p>
                    </div>
                  )}
                  {trade.exit_emotion && (
                    <div>
                      <span className="text-sm text-muted-foreground">Exit Emotion:</span>
                      <p className="font-medium capitalize">{trade.exit_emotion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Context */}
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

              {/* Risk Management */}
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">Risk Management</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Stop Loss:</span>
                    <p className="font-medium">{trade.stop_loss ? `₹${trade.stop_loss}` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Target:</span>
                    <p className="font-medium">{trade.planned_target ? `₹${trade.planned_target}` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Risk/Reward:</span>
                    <p className="font-medium">{trade.planned_risk_reward ? `${trade.planned_risk_reward}:1` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Actual R/R:</span>
                    <p className="font-medium">{trade.actual_risk_reward ? `${trade.actual_risk_reward}:1` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
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

              {/* Behavioral Analysis */}
              <div className="col-span-full bg-card p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-4">Behavioral Analysis</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Followed Plan:</span>
                    <p className="font-medium">{trade.followed_plan ? 'Yes' : 'No'}</p>
                  </div>
                  {!trade.followed_plan && trade.plan_deviation_reason && (
                    <div>
                      <span className="text-sm text-muted-foreground">Deviation Reason:</span>
                      <p className="font-medium">{trade.plan_deviation_reason}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">FOMO Trade:</span>
                      <p className="font-medium">{trade.is_fomo_trade ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Impulsive Exit:</span>
                      <p className="font-medium">{trade.is_impulsive_exit ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              {trade.ai_feedback && (
                <div className="col-span-full bg-card p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-4">AI Feedback</h4>
                  <p className="text-sm whitespace-pre-wrap">{trade.ai_feedback}</p>
                </div>
              )}

              {/* Notes */}
              {trade.notes && (
                <div className="col-span-full bg-card p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-4">Notes</h4>
                  <p className="text-sm whitespace-pre-wrap">{trade.notes}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
