
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RiskRewardMetricsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RiskRewardMetrics({
  formData,
  handleChange,
}: RiskRewardMetricsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="planned_risk_reward">Planned Risk/Reward</Label>
          <Input
            id="planned_risk_reward"
            name="planned_risk_reward"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.planned_risk_reward}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="actual_risk_reward">Actual Risk/Reward</Label>
          <Input
            id="actual_risk_reward"
            name="actual_risk_reward"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.actual_risk_reward}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="planned_target">Planned Target</Label>
          <Input
            id="planned_target"
            name="planned_target"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.planned_target}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slippage">Slippage</Label>
          <Input
            id="slippage"
            name="slippage"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.slippage}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
