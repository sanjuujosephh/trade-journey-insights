
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
import { Trash2, Maximize2, Image, Pencil } from "lucide-react";
import { Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TradeHistoryProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeHistory({ trades, onEdit, onDelete, onViewDetails, showEditButton = false }: TradeHistoryProps) {
  const { toast } = useToast();

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

  const getOutcomeStyle = (pnl: number | null) => {
    if (pnl === null) return 'bg-gray-100 text-gray-800';
    if (pnl > 0) return 'bg-green-100 text-green-800';
    if (pnl < 0) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getOutcomeText = (pnl: number | null) => {
    if (pnl === null) return 'Pending';
    if (pnl > 0) return 'Profit';
    if (pnl < 0) return 'Loss';
    return 'Breakeven';
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      onDelete(id);
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 glass">
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
            {trades.map((trade) => {
              const pnl = calculatePnL(trade);
              return (
                <TableRow key={trade.id}>
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
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${getOutcomeStyle(pnl)}`}
                    >
                      {getOutcomeText(pnl)}
                    </span>
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
                        onClick={() => handleDelete(trade.id)}
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
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

