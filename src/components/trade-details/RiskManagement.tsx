
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
      </div>
    </div>
  );
}
