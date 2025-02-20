
import { Trade } from "@/types/trade";

interface BehavioralAnalysisProps {
  trade: Trade;
}

export function BehavioralAnalysis({ trade }: BehavioralAnalysisProps) {
  return (
    <div className="col-span-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Behavioral Analysis</h4>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-muted-foreground">Followed Plan:</span>
          <p className="font-medium">{trade.followed_plan ? 'Yes' : 'No'}</p>
        </div>
        {!trade.followed_plan && trade.plan_deviation_reason && (
          <div>
            <span className="text-sm text-muted-foreground">Deviation Reason:</span>
            <p className="font-medium">{trade.plan_deviation_reason}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">FOMO Trade:</span>
            <p className="font-medium">{trade.is_fomo_trade ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Impulsive Exit:</span>
            <p className="font-medium">{trade.is_impulsive_exit ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
