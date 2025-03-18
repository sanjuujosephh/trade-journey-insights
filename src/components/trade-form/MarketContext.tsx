
import { FormData } from "@/types/trade";
import { MarketConditionSelect } from "./market-context/MarketConditionSelect";
import { TimeframeSelect } from "./market-context/TimeframeSelect";
import { StrategySelect } from "./market-context/StrategySelect";
import { ExitReasonSelect } from "./market-context/ExitReasonSelect";
import { EmotionSelects } from "./market-context/EmotionSelects";

interface MarketContextProps {
  formData: FormData;
  onSelectChange: (name: string, value: string | boolean) => void;
}

export function MarketContext({ formData, onSelectChange }: MarketContextProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketConditionSelect
          value={formData.market_condition}
          onValueChange={(value) => onSelectChange("market_condition", value)}
        />
        <TimeframeSelect
          value={formData.timeframe}
          onValueChange={(value) => onSelectChange("timeframe", value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrategySelect
          value={formData.strategy}
          onValueChange={(value) => onSelectChange("strategy", value)}
        />
        <ExitReasonSelect
          value={formData.exit_reason}
          onValueChange={(value) => onSelectChange("exit_reason", value)}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-base font-medium mb-4">Psychological Factors</h3>
        <EmotionSelects
          entryEmotion={formData.entry_emotion}
          exitEmotion={formData.exit_emotion}
          confidenceLevel={formData.confidence_level}
          satisfactionScore={formData.satisfaction_score}
          isImpulsive={formData.is_impulsive}
          planDeviation={formData.plan_deviation}
          onEntryEmotionChange={(value) => onSelectChange("entry_emotion", value)}
          onExitEmotionChange={(value) => onSelectChange("exit_emotion", value)}
          onConfidenceLevelChange={(value) => onSelectChange("confidence_level", value)}
          onSatisfactionScoreChange={(value) => onSelectChange("satisfaction_score", value)}
          onIsImpulsiveChange={(value) => onSelectChange("is_impulsive", value)}
          onPlanDeviationChange={(value) => onSelectChange("plan_deviation", value)}
        />
      </div>
    </div>
  );
}
