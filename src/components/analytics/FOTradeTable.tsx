
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FOTradeTableProps {
  trades: Trade[];
  onReplayTrade?: (trade: Trade) => void;
}

export function FOTradeTable({ trades, onReplayTrade }: FOTradeTableProps) {
  const validTrades = trades.filter(t => t.exit_price && t.quantity);

  const calculateHoldingTime = (entry: string, exit: string) => {
    const duration = new Date(exit).getTime() - new Date(entry).getTime();
    return Math.round(duration / (1000 * 60)); // Convert to minutes
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">F&O Trade History</h3>
      <div className="rounded-md border">
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
              <TableHead>Action</TableHead>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReplayTrade?.(trade)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
