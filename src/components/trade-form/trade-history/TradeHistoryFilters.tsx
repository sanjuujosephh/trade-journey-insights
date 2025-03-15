
import { Filter } from "lucide-react";
import { SearchBar } from "./filters/SearchBar";
import { PrimaryFilters } from "./filters/PrimaryFilters";
import { AdvancedFilters } from "./filters/AdvancedFilters";
import { FilterResults } from "./filters/FilterResults";

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
  
  // Fix: Ensure this is a boolean by using Boolean() or a comparison
  const showClearFiltersButton = Boolean(
    searchTerm || 
    outcomeFilter !== "all" || 
    symbolFilter !== "all" || 
    tradeTypeFilter !== "all" ||
    directionFilter !== "all" ||
    optionTypeFilter !== "all" ||
    timeframeFilter !== "all" ||
    marketConditionFilter !== "all" ||
    entryEmotionFilter !== "all" ||
    exitEmotionFilter !== "all"
  );
  
  return (
    <div className="mb-4 space-y-4">
      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        {/* Primary Filters */}
        <PrimaryFilters
          symbolFilter={symbolFilter}
          setSymbolFilter={setSymbolFilter}
          outcomeFilter={outcomeFilter}
          setOutcomeFilter={setOutcomeFilter}
          tradeTypeFilter={tradeTypeFilter}
          setTradeTypeFilter={setTradeTypeFilter}
          uniqueSymbols={uniqueSymbols}
          showClearFiltersButton={showClearFiltersButton}
          resetFilters={resetFilters}
        />
      </div>
      
      {/* Advanced Filters */}
      <AdvancedFilters
        directionFilter={directionFilter}
        setDirectionFilter={setDirectionFilter}
        optionTypeFilter={optionTypeFilter}
        setOptionTypeFilter={setOptionTypeFilter}
        timeframeFilter={timeframeFilter}
        setTimeframeFilter={setTimeframeFilter}
        marketConditionFilter={marketConditionFilter}
        setMarketConditionFilter={setMarketConditionFilter}
        entryEmotionFilter={entryEmotionFilter}
        setEntryEmotionFilter={setEntryEmotionFilter}
        exitEmotionFilter={exitEmotionFilter}
        setExitEmotionFilter={setExitEmotionFilter}
      />
      
      {/* Results count */}
      <FilterResults tradesCount={tradesCount} />
    </div>
  );
}
