
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradeHistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  outcomeFilter: string;
  setOutcomeFilter: (value: string) => void;
  symbolFilter: string;
  setSymbolFilter: (value: string) => void;
  tradeTypeFilter: string;
  setTradeTypeFilter: (value: string) => void;
  uniqueSymbols: string[];
  resetFilters: () => void;
  tradesCount: {
    filtered: number;
    total: number;
  };
}

export function TradeHistoryFilters({
  searchTerm,
  setSearchTerm,
  outcomeFilter,
  setOutcomeFilter,
  symbolFilter,
  setSymbolFilter,
  tradeTypeFilter,
  setTradeTypeFilter,
  uniqueSymbols,
  resetFilters,
  tradesCount
}: TradeHistoryFiltersProps) {
  return (
    <div className="mb-4 space-y-4">
      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1">
          <Input
            placeholder="Search by symbol or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Filter UI directly in the main view */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={symbolFilter} onValueChange={setSymbolFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Symbol</SelectItem>
              {uniqueSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Outcome</SelectItem>
              <SelectItem value="profit">Profit</SelectItem>
              <SelectItem value="loss">Loss</SelectItem>
              <SelectItem value="breakeven">Breakeven</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tradeTypeFilter} onValueChange={setTradeTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Type</SelectItem>
              <SelectItem value="options">Options</SelectItem>
              <SelectItem value="futures">Futures</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
            </SelectContent>
          </Select>
          
          {(outcomeFilter || symbolFilter || tradeTypeFilter || searchTerm) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
              className="h-10"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {tradesCount.filtered} of {tradesCount.total} trades
      </div>
    </div>
  );
}
