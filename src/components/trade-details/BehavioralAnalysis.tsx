
import { Trade } from "@/types/trade";

interface BehavioralAnalysisProps {
  trade: Trade;
}

export function BehavioralAnalysis({ trade }: BehavioralAnalysisProps) {
  const followedPlan = trade.exit_reason === 'target' || trade.exit_reason === 'stop_loss';
  const isImpulsive = trade.exit_reason === 'manual';

  return (
    <div className="col-span-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Behavioral Analysis</h4>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-muted-foreground">Followed Plan:</span>
          <p className="font-medium">{followedPlan ? 'Yes' : 'No'}</p>
        </div>
        {!followedPlan && (
          <div>
            <span className="text-sm text-muted-foreground">Deviation Type:</span>
            <p className="font-medium">{trade.exit_reason}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Entry Emotion:</span>
            <p className="font-medium">{trade.entry_emotion || 'Not recorded'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Impulsive Exit:</span>
            <p className="font-medium">{isImpulsive ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
