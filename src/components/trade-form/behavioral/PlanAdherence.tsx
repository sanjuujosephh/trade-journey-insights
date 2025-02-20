
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PlanAdherenceProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: boolean) => void;
}

export function PlanAdherence({
  formData,
  handleChange,
  handleSelectChange,
}: PlanAdherenceProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="plan_deviation_reason">Plan Deviation Reason</Label>
        <Input
          id="plan_deviation_reason"
          name="plan_deviation_reason"
          placeholder="Reason for deviating from the trading plan"
          value={formData.plan_deviation_reason}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="followed_plan">Followed Plan?</Label>
        <Switch
          id="followed_plan"
          name="followed_plan"
          checked={formData.followed_plan}
          onCheckedChange={(checked) => handleSelectChange("followed_plan", checked)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="is_fomo_trade">FOMO Trade?</Label>
        <Switch
          id="is_fomo_trade"
          name="is_fomo_trade"
          checked={formData.is_fomo_trade}
          onCheckedChange={(checked) => handleSelectChange("is_fomo_trade", checked)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="is_impulsive_exit">Impulsive Exit?</Label>
        <Switch
          id="is_impulsive_exit"
          name="is_impulsive_exit"
          checked={formData.is_impulsive_exit}
          onCheckedChange={(checked) => handleSelectChange("is_impulsive_exit", checked)}
        />
      </div>
    </>
  );
}
