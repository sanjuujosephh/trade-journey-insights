
import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";

interface TradeDecisionQualityProps {
  trades: Trade[];
}

export function TradeDecisionQuality({ trades }: TradeDecisionQualityProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Trade Decision Quality Analysis</h3>
      <p className="text-muted-foreground">
        This component will analyze the quality of your trading decisions based on plan adherence, 
        impulsiveness, and outcome correlation. More data is needed to provide meaningful analysis.
      </p>
    </Card>
  );
}
