
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
import { TradeRow } from "./TradeRow";

interface TradeHistoryTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeHistoryTable({ 
  trades, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  showEditButton = false 
}: TradeHistoryTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      // Call the parent's onDelete function
      onDelete(id);
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
          {trades.length > 0 ? (
            trades.map((trade) => (
              <TradeRow 
                key={trade.id}
                trade={trade}
                onEdit={onEdit}
                onDelete={handleDelete}
                onViewDetails={onViewDetails}
                showEditButton={showEditButton}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No trades match your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
