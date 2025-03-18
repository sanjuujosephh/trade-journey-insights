
import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";

interface StressPerformanceCorrelationProps {
  trades: Trade[];
}

export function StressPerformanceCorrelation({ trades }: StressPerformanceCorrelationProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Stress & Performance Correlation</h3>
      <p className="text-muted-foreground">
        This component will analyze how stress levels and time pressure impact your trading performance.
        More data is needed to provide meaningful analysis.
      </p>
    </Card>
  );
}
