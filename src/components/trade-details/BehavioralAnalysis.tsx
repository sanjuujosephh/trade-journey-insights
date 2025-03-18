
import { Trade } from "@/types/trade";
import { EnhancedBehavioralAnalysis } from "./EnhancedBehavioralAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Brain } from "lucide-react";

interface BehavioralAnalysisProps {
  trade: Trade;
}

export function BehavioralAnalysis({ trade }: BehavioralAnalysisProps) {
  // Check if any behavioral data exists
  const hasBehavioralData = 
    trade.is_impulsive !== null || 
    trade.plan_deviation !== null ||
    trade.satisfaction_score !== null ||
    trade.stress_level !== null ||
    trade.time_pressure !== null ||
    trade.entry_emotion ||
    trade.exit_emotion;
  
  if (!hasBehavioralData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            <span>Behavioral Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>No behavioral data recorded for this trade.</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return <EnhancedBehavioralAnalysis trade={trade} />;
}
