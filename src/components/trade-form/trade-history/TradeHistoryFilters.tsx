
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
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
  directionFilter: string;
  setDirectionFilter: (value: string) => void;
  optionTypeFilter: string;
  setOptionTypeFilter: (value: string) => void;
  timeframeFilter: string;
  setTimeframeFilter: (value: string) => void;
  marketConditionFilter: string;
  setMarketConditionFilter: (value: string) => void;
  entryEmotionFilter: string;
  setEntryEmotionFilter: (value: string) => void;
  exitEmotionFilter: string;
  setExitEmotionFilter: (value: string) => void;
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
  directionFilter,
  setDirectionFilter,
  optionTypeFilter,
  setOptionTypeFilter,
  timeframeFilter,
  setTimeframeFilter,
  marketConditionFilter,
  setMarketConditionFilter,
  entryEmotionFilter,
  setEntryEmotionFilter,
  exitEmotionFilter,
  setExitEmotionFilter,
  uniqueSymbols,
  resetFilters,
  tradesCount
}: TradeHistoryFiltersProps) {
  
  const showClearFiltersButton = 
    searchTerm || 
    outcomeFilter !== "all" || 
    symbolFilter !== "all" || 
    tradeTypeFilter !== "all" ||
    directionFilter !== "all" ||
    optionTypeFilter !== "all" ||
    timeframeFilter !== "all" ||
    marketConditionFilter !== "all" ||
    entryEmotionFilter !== "all" ||
    exitEmotionFilter !== "all";
  
  return (
    <div className="mb-4 space-y-4">
      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-3/5 md:w-2/5">
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
        
        {/* Primary Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={symbolFilter} onValueChange={setSymbolFilter}>
            <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Symbol</SelectItem>
              {uniqueSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
            <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Outcome</SelectItem>
              <SelectItem value="profit">Profit</SelectItem>
              <SelectItem value="loss">Loss</SelectItem>
              <SelectItem value="breakeven">Breakeven</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={tradeTypeFilter} onValueChange={setTradeTypeFilter}>
            <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="options">Options</SelectItem>
              <SelectItem value="futures">Futures</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
            </SelectContent>
          </Select>
          
          {showClearFiltersButton && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
              className="h-10 ml-auto"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Direction</SelectItem>
            <SelectItem value="long">Long</SelectItem>
            <SelectItem value="short">Short</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={optionTypeFilter} onValueChange={setOptionTypeFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Option Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Option</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="put">Put</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Timeframe</SelectItem>
            <SelectItem value="1min">1 Minute</SelectItem>
            <SelectItem value="3min">3 Minutes</SelectItem>
            <SelectItem value="5min">5 Minutes</SelectItem>
            <SelectItem value="15min">15 Minutes</SelectItem>
            <SelectItem value="1hr">1 Hour</SelectItem>
            <SelectItem value="4hr">4 Hours</SelectItem>
            <SelectItem value="1day">1 Day</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={marketConditionFilter} onValueChange={setMarketConditionFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Market</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="ranging">Ranging</SelectItem>
            <SelectItem value="volatile">Volatile</SelectItem>
            <SelectItem value="news_driven">News Driven</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={entryEmotionFilter} onValueChange={setEntryEmotionFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Entry Emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Emotion</SelectItem>
            <SelectItem value="fear">Fear</SelectItem>
            <SelectItem value="greed">Greed</SelectItem>
            <SelectItem value="fomo">FOMO</SelectItem>
            <SelectItem value="revenge">Revenge</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="confident">Confident</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={exitEmotionFilter} onValueChange={setExitEmotionFilter}>
          <SelectTrigger className="w-[130px]" style={{ paddingLeft: "8px" }}>
            <SelectValue placeholder="Exit Emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Emotion</SelectItem>
            <SelectItem value="satisfied">Satisfied</SelectItem>
            <SelectItem value="regretful">Regretful</SelectItem>
            <SelectItem value="relieved">Relieved</SelectItem>
            <SelectItem value="frustrated">Frustrated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {tradesCount.filtered} of {tradesCount.total} trades
      </div>
    </div>
  );
}
