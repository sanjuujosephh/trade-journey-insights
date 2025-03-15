
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2, Image, Pencil } from "lucide-react";
import { Trade } from "@/types/trade";
import { TradeOutcomeBadge } from "./TradeOutcomeBadge";

interface TradeRowProps {
  trade: Trade;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeRow({ trade, onEdit, onDelete, onViewDetails, showEditButton = false }: TradeRowProps) {
  const formatDisplayTime = (time: string | null) => {
    if (!time) return "";
    return time;
  };

  const formatDisplayDate = (date: string | null) => {
    if (!date) return "";
    return date;
  };

  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return null;
    return (trade.exit_price - trade.entry_price) * trade.quantity;
  };

  const formatPnL = (pnl: number | null) => {
    if (pnl === null) return '-';
    return `₹${pnl.toFixed(2)}`;
  };

  const pnl = calculatePnL(trade);

  return (
    <TableRow>
      <TableCell>
        {formatDisplayDate(trade.entry_date)}
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
        {formatPnL(pnl)}
      </TableCell>
      <TableCell>
        <TradeOutcomeBadge pnl={pnl} />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {showEditButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(trade)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
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
  );
}
