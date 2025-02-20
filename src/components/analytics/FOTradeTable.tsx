
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trade } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { Eye, ChartLine, Play } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FOTradeTableProps {
  trades: Trade[];
  onReplayTrade?: (trade: Trade) => void;
  onViewDetails?: (trade: Trade) => void;
}

export function FOTradeTable({ trades, onReplayTrade, onViewDetails }: FOTradeTableProps) {
  const validTrades = trades.filter(t => t.exit_price && t.quantity);

  const calculateHoldingTime = (entry: string, exit: string) => {
    const duration = new Date(exit).getTime() - new Date(entry).getTime();
    return Math.round(duration / (1000 * 60)); // Convert to minutes
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lots</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validTrades.map((trade) => {
            const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
            const duration = trade.entry_time && trade.exit_time 
              ? calculateHoldingTime(trade.entry_time, trade.exit_time)
              : 0;

            return (
              <TableRow key={trade.id}>
                <TableCell>{format(new Date(trade.entry_time || trade.timestamp), 'HH:mm:ss')}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>{trade.trade_type === 'intraday' ? '' : trade.trade_type}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{trade.entry_price}</TableCell>
                <TableCell>{trade.exit_price}</TableCell>
                <TableCell>{duration} min</TableCell>
                <TableCell className={cn(
                  "font-medium",
                  pnl > 0 ? "text-green-600" : pnl < 0 ? "text-red-600" : ""
                )}>
                  ₹{pnl.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails?.(trade)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {trade.chart_link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(trade.chart_link, '_blank')}
                      >
                        <ChartLine className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReplayTrade?.(trade)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
