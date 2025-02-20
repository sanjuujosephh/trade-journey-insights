
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Maximize2, Image } from "lucide-react";
import { Trade } from "@/types/trade";

interface TradeHistoryProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
}

export function TradeHistory({ trades, onEdit, onDelete, onViewDetails }: TradeHistoryProps) {
  const formatDisplayTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="p-6 glass">
      <h3 className="text-lg font-medium mb-4">Trade History</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Exit</TableHead>
              <TableHead>P/L</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  {trade.entry_time 
                    ? new Date(trade.entry_time).toLocaleDateString()
                    : new Date(trade.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>{trade.trade_type}</TableCell>
                <TableCell>
                  ₹{trade.entry_price}
                  {trade.entry_time && (
                    <div className="text-xs text-muted-foreground">
                      {formatDisplayTime(trade.entry_time)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {trade.exit_price ? (
                    <>
                      ₹{trade.exit_price}
                      {trade.exit_time && (
                        <div className="text-xs text-muted-foreground">
                          {formatDisplayTime(trade.exit_time)}
                        </div>
                      )}
                    </>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {trade.exit_price && trade.quantity
                    ? `₹${((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)).toFixed(2)}`
                    : '-'}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text

-xs ${
                      trade.outcome === "profit"
                        ? "bg-green-100 text-green-800"
                        : trade.outcome === "loss"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {trade.outcome}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(trade)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(trade.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(trade)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    {trade.chart_link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(trade.chart_link, '_blank')}
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
