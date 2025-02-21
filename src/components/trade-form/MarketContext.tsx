
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function MarketContext({
  formData,
  handleChange,
  handleSelectChange,
}: MarketContextProps) {
  return (
    <Card className="p-6 space-y-4 glass">
      <MarketConditionSelect
        value={formData.market_condition}
        onValueChange={(value) => handleSelectChange("market_condition", value)}
      />

      <StrategySelect
        value={formData.strategy}
        onValueChange={(value) => handleSelectChange("strategy", value)}
      />

      <TimeframeSelect
        value={formData.timeframe}
        onValueChange={(value) => handleSelectChange("timeframe", value)}
      />

      <div className="space-y-2">
        <OptionPricePosition 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
        />
      </div>

      <EmotionSelects
        entryEmotion={formData.entry_emotion}
        exitEmotion={formData.exit_emotion}
        onEntryEmotionChange={(value) => handleSelectChange("entry_emotion", value)}
        onExitEmotionChange={(value) => handleSelectChange("exit_emotion", value)}
      />

      <ExitReasonSelect
        value={formData.exit_reason}
        onValueChange={(value) => handleSelectChange("exit_reason", value)}
      />

      <TradeNotes
        value={formData.notes}
        onChange={handleChange}
      />
    </Card>
  );
}
