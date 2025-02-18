
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Trade {
  id: string;
  symbol: string;
  entry_price: number;
  exit_price?: number;
  quantity?: number;
  trade_type: string;
  stop_loss?: number;
  target?: number;
  strategy?: string;
  outcome: string;
  notes?: string;
  timestamp: string;
  entry_time?: string;
  exit_time?: string;
  user_id?: string;
  chart_link?: string;
}

interface TradeDetailsDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsDialog({ trade, open, onOpenChange }: TradeDetailsDialogProps) {
  if (!trade) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculatePnL = () => {
    if (!trade.exit_price || !trade.quantity) return null;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
    return pnl.toFixed(2);
  };

  const getEmbedUrl = (chartLink: string) => {
    try {
      // Convert TradingView chart URL to embedded format
      const url = new URL(chartLink);
      if (url.hostname === 'www.tradingview.com' || url.hostname === 'tradingview.com') {
        // Extract chart ID from the path
        const chartId = url.pathname.split('/').pop();
        return `https://www.tradingview.com/chart/embedded/${chartId}`;
      }
      return chartLink; // Return original link if not a TradingView URL
    } catch (e) {
      console.error('Invalid URL:', e);
      return chartLink;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Trade Details - {trade.symbol}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh]">
          {trade.chart_link && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Chart</h4>
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={getEmbedUrl(trade.chart_link)}
                  className="w-full h-full"
                  title="TradingView Chart"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            </div>
          )}
          
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
              </div>
            </div>

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
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Trade Information</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <p>{trade.trade_type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <p>{trade.quantity || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Strategy:</span>
                  <p>{trade.strategy || 'N/A'}</p>
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
                  <p>{trade.target ? `₹${trade.target}` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm font-medium">Results</h4>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-sm text-muted-foreground">Outcome:</span>
                  <p className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    trade.outcome === "profit"
                      ? "bg-green-100 text-green-800"
                      : trade.outcome === "loss"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {trade.outcome}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">P/L:</span>
                  <p className={calculatePnL() && parseFloat(calculatePnL()!) > 0 ? "text-green-600" : "text-red-600"}>
                    {calculatePnL() ? `₹${calculatePnL()}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

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
