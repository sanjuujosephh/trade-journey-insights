
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedFiltersProps {
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
}

export function AdvancedFilters({
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
  setExitEmotionFilter
}: AdvancedFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={directionFilter} onValueChange={setDirectionFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Direction</SelectItem>
          <SelectItem value="long">Long</SelectItem>
          <SelectItem value="short">Short</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={optionTypeFilter} onValueChange={setOptionTypeFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Option</SelectItem>
          <SelectItem value="call">Call</SelectItem>
          <SelectItem value="put">Put</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Timeframe" />
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
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Market" />
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
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Entry Emotion" />
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
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Any Exit Emotion" />
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
  );
}
