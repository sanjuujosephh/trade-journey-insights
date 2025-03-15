
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrimaryFiltersProps {
  symbolFilter: string;
  setSymbolFilter: (value: string) => void;
  outcomeFilter: string;
  setOutcomeFilter: (value: string) => void;
  tradeTypeFilter: string;
  setTradeTypeFilter: (value: string) => void;
  uniqueSymbols: string[];
}

export function PrimaryFilters({
  symbolFilter,
  setSymbolFilter,
  outcomeFilter,
  setOutcomeFilter,
  tradeTypeFilter,
  setTradeTypeFilter,
  uniqueSymbols
}: PrimaryFiltersProps) {
  return (
    <>
      <Select value={symbolFilter} onValueChange={setSymbolFilter}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Any Symbol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Symbol</SelectItem>
          {uniqueSymbols.map(symbol => (
            <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Any Outcome" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Outcome</SelectItem>
          <SelectItem value="profit">Profit</SelectItem>
          <SelectItem value="loss">Loss</SelectItem>
          <SelectItem value="breakeven">Breakeven</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={tradeTypeFilter} onValueChange={setTradeTypeFilter}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Any Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Type</SelectItem>
          <SelectItem value="options">Options</SelectItem>
          <SelectItem value="futures">Futures</SelectItem>
          <SelectItem value="equity">Equity</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
