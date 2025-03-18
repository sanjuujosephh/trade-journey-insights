
import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";

interface DevotionScoreAnalysisProps {
  trades: Trade[];
}

export function DevotionScoreAnalysis({ trades }: DevotionScoreAnalysisProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Trading Discipline Analysis</h3>
      <p className="text-muted-foreground">
        This component will analyze your trading discipline by tracking plan adherence, 
        emotional control, and consistency in decision-making. More data is needed to provide meaningful analysis.
      </p>
    </Card>
  );
}
