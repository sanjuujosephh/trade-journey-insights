
import { SearchBar } from "./filters/SearchBar";
import { PrimaryFilters } from "./filters/PrimaryFilters";
import { AdvancedFilters } from "./filters/AdvancedFilters";
import { FilterResults } from "./filters/FilterResults";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

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
      {/* Top row with search and all filters in one row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <div className="w-full md:w-2/3 flex flex-wrap justify-between">
          <div className="flex items-center flex-wrap gap-2">
            <PrimaryFilters
              symbolFilter={symbolFilter}
              setSymbolFilter={setSymbolFilter}
              outcomeFilter={outcomeFilter}
              setOutcomeFilter={setOutcomeFilter}
              tradeTypeFilter={tradeTypeFilter}
              setTradeTypeFilter={setTradeTypeFilter}
              uniqueSymbols={uniqueSymbols}
            />
            
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
          </div>
          
          {showClearFiltersButton && (
            <div className="mt-2 md:mt-0">
              <Button 
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="ml-2 border border-primary text-primary"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Results count row */}
      <div className="w-full">
        <FilterResults tradesCount={tradesCount} />
      </div>
    </div>
  );
}
