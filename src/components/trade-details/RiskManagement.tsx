
import { Trade } from "@/types/trade";

interface RiskManagementProps {
  trade: Trade;
}

export function RiskManagement({ trade }: RiskManagementProps) {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Risk Management</h4>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-muted-foreground">Stop Loss:</span>
          <p className="font-medium">{trade.stop_loss ? `₹${trade.stop_loss}` : 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Target:</span>
          <p className="font-medium">{trade.planned_target ? `₹${trade.planned_target}` : 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Risk/Reward:</span>
          <p className="font-medium">{trade.planned_risk_reward ? `${trade.planned_risk_reward}:1` : 'N/A'}</p>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Actual R/R:</span>
          <p className="font-medium">{trade.actual_risk_reward ? `${trade.actual_risk_reward}:1` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
