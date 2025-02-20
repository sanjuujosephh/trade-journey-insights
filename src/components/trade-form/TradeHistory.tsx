
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Maximize2, Image } from "lucide-react";
import type { Trade } from "@/types/trade";

interface TradeHistoryProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  formatDisplayTime: (dateString: string) => string;
}

export function TradeHistory({
  trades,
  onEdit,
  onDelete,
  onViewDetails,
  formatDisplayTime,
}: TradeHistoryProps) {
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