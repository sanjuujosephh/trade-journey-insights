
import { Card } from "@/components/ui/card";
import { OptionPricePosition } from "./behavioral/OptionPricePosition";
import { MarketConditionSelect } from "./market-context/MarketConditionSelect";
import { StrategySelect } from "./market-context/StrategySelect";
import { TimeframeSelect } from "./market-context/TimeframeSelect";
import { EmotionSelects } from "./market-context/EmotionSelects";
import { ExitReasonSelect } from "./market-context/ExitReasonSelect";
import { TradeNotes } from "./market-context/TradeNotes";

interface MarketContextProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function MarketContext({
  formData,
  handleChange,
  handleSelectChange
}: MarketContextProps) {
  return <Card className="p-6 space-y-4 glass">
      <div className="space-y-2">
        <MarketConditionSelect value={formData.market_condition} onValueChange={value => handleSelectChange("market_condition", value)} />
        <div className="text-xs text-muted-foreground">Overall market sentiment at the time of trade</div>
      </div>

      <div className="space-y-2">
        <StrategySelect value={formData.strategy} onValueChange={value => handleSelectChange("strategy", value)} />
        <div className="text-xs text-muted-foreground">Trading strategy you applied for this trade</div>
      </div>

      <div className="space-y-2">
        <TimeframeSelect value={formData.timeframe} onValueChange={value => handleSelectChange("timeframe", value)} />
        <div className="text-xs text-muted-foreground">Time horizon for the trade execution</div>
      </div>

      <div className="space-y-2">
        <OptionPricePosition formData={formData} handleSelectChange={handleSelectChange} />
        <div className="text-xs text-muted-foreground">Position relative to key technical indicators</div>
      </div>

      <div className="space-y-2">
        <EmotionSelects entryEmotion={formData.entry_emotion} exitEmotion={formData.exit_emotion} onEntryEmotionChange={value => handleSelectChange("entry_emotion", value)} onExitEmotionChange={value => handleSelectChange("exit_emotion", value)} />
        <div className="text-xs text-muted-foreground">Your psychological state during trade entry and exit</div>
      </div>

      <div className="space-y-2">
        <ExitReasonSelect value={formData.exit_reason} onValueChange={value => handleSelectChange("exit_reason", value)} />
        <div className="text-xs text-muted-foreground">Primary reason for exiting the trade</div>
      </div>

      <div className="space-y-2">
        <TradeNotes value={formData.notes} onChange={handleChange} />
        <div className="text-xs text-muted-foreground">⚠️ This information is needed for AI Analysis. Explain why you took the trade & add additional observations, learnings, or details about the trade.</div>
      </div>
    </Card>;
}
