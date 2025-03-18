
import { Trade } from "@/types/trade";
import { EnhancedBehavioralAnalysis } from "./EnhancedBehavioralAnalysis";

interface BehavioralAnalysisProps {
  trade: Trade;
}

export function BehavioralAnalysis({ trade }: BehavioralAnalysisProps) {
  return <EnhancedBehavioralAnalysis trade={trade} />;
}
