
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { useState, useMemo } from "react";
import { TradeHistoryFilters } from "./trade-history/TradeHistoryFilters";
import { TradeHistoryTable } from "./trade-history/TradeHistoryTable";
import { useToast } from "@/hooks/use-toast";

interface TradeHistoryProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  showEditButton?: boolean;
}

export function TradeHistory({ trades, onEdit, onDelete, onViewDetails, showEditButton = false }: TradeHistoryProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("");
  const [symbolFilter, setSymbolFilter] = useState<string>("");
  const [tradeTypeFilter, setTradeTypeFilter] = useState<string>("");

  // Get unique symbols for filter dropdown
  const uniqueSymbols = useMemo(() => {
    return Array.from(new Set(trades.map(trade => trade.symbol))).sort();
  }, [trades]);
  
  // Filter trades based on search term and filters
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      // Search term filtering (case insensitive)
      const matchesSearch = !searchTerm || 
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Calculate PnL for outcome filtering
      const pnl = trade.exit_price && trade.entry_price && trade.quantity
        ? (trade.exit_price - trade.entry_price) * trade.quantity 
        : null;
      
      // Outcome filtering
      let matchesOutcome = true;
      if (outcomeFilter) {
        if (outcomeFilter === "profit") {
          matchesOutcome = pnl !== null && pnl > 0;
        } else if (outcomeFilter === "loss") {
          matchesOutcome = pnl !== null && pnl < 0;
        } else if (outcomeFilter === "breakeven") {
          matchesOutcome = pnl !== null && pnl === 0;
        }
      }
      
      // Symbol filtering
      const matchesSymbol = !symbolFilter || trade.symbol === symbolFilter;
      
      // Trade type filtering
      const matchesTradeType = !tradeTypeFilter || trade.trade_type === tradeTypeFilter;
      
      return matchesSearch && matchesOutcome && matchesSymbol && matchesTradeType;
    });
  }, [trades, searchTerm, outcomeFilter, symbolFilter, tradeTypeFilter]);

  const sortedTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      const dateA = a.entry_date ? new Date(a.entry_date.split('-').reverse().join('-')) : new Date(0);
      const dateB = b.entry_date ? new Date(b.entry_date.split('-').reverse().join('-')) : new Date(0);
      
      const dateDiff = dateB.getTime() - dateA.getTime();
      
      if (dateDiff !== 0) return dateDiff;
      
      const timeA = a.entry_time || "";
      const timeB = b.entry_time || "";
      return timeB.localeCompare(timeA);
    });
  }, [filteredTrades]);

  const resetFilters = () => {
    setSearchTerm("");
    setOutcomeFilter("");
    setSymbolFilter("");
    setTradeTypeFilter("");
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };

  console.log("Filter values:", { 
    searchTerm, 
    outcomeFilter, 
    symbolFilter, 
    tradeTypeFilter,
    filteredCount: filteredTrades.length,
    totalCount: trades.length
  });

  return (
    <Card className="p-6 glass">
      <TradeHistoryFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        outcomeFilter={outcomeFilter}
        setOutcomeFilter={setOutcomeFilter}
        symbolFilter={symbolFilter}
        setSymbolFilter={setSymbolFilter}
        tradeTypeFilter={tradeTypeFilter}
        setTradeTypeFilter={setTradeTypeFilter}
        uniqueSymbols={uniqueSymbols}
        resetFilters={resetFilters}
        tradesCount={{ filtered: sortedTrades.length, total: trades.length }}
      />
      
      <TradeHistoryTable 
        trades={sortedTrades}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDetails={onViewDetails}
        showEditButton={showEditButton}
      />
    </Card>
  );
}
