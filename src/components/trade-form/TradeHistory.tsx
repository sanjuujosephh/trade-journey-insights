
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { useState } from "react";
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
  const [showFilters, setShowFilters] = useState(false);

  // Get unique symbols for filter dropdown
  const uniqueSymbols = Array.from(new Set(trades.map(trade => trade.symbol))).sort();
  
  // Filter trades based on search term and filters
  const filteredTrades = trades.filter(trade => {
    // Search term filtering (case insensitive)
    const matchesSearch = !searchTerm || 
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trade.notes && trade.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Outcome filtering
    const matchesOutcome = !outcomeFilter || trade.outcome === outcomeFilter;
    
    // Symbol filtering
    const matchesSymbol = !symbolFilter || trade.symbol === symbolFilter;
    
    // Trade type filtering
    const matchesTradeType = !tradeTypeFilter || trade.trade_type === tradeTypeFilter;
    
    return matchesSearch && matchesOutcome && matchesSymbol && matchesTradeType;
  });

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const dateA = a.entry_date ? new Date(a.entry_date.split('-').reverse().join('-')) : new Date(0);
    const dateB = b.entry_date ? new Date(b.entry_date.split('-').reverse().join('-')) : new Date(0);
    
    const dateDiff = dateB.getTime() - dateA.getTime();
    
    if (dateDiff !== 0) return dateDiff;
    
    const timeA = a.entry_time || "";
    const timeB = b.entry_time || "";
    return timeB.localeCompare(timeA);
  });

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
        showFilters={showFilters}
        setShowFilters={setShowFilters}
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
