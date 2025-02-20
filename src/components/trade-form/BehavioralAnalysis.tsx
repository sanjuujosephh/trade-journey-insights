
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface BehavioralAnalysisProps {
  formData: {
    followed_plan: boolean;
    plan_deviation_reason: string;
    is_fomo_trade: boolean;
    is_impulsive_exit: boolean;
    notes: string;
    chart_link: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: boolean) => void;
}

export function BehavioralAnalysis({
  formData,
  handleChange,
  handleSelectChange,
}: BehavioralAnalysisProps) {
  return (
    <Card className="p-6 space-y-4 glass">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="followed_plan"
            checked={formData.followed_plan}
            onCheckedChange={(checked) => 
              handleSelectChange("followed_plan", checked === true)
            }
          />
          <Label htmlFor="followed_plan">Followed Trading Plan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_fomo_trade"
            checked={formData.is_fomo_trade}
            onCheckedChange={(checked) => 
              handleSelectChange("is_fomo_trade", checked === true)
            }
          />
          <Label htmlFor="is_fomo_trade">FOMO Trade</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_impulsive_exit"
            checked={formData.is_impulsive_exit}
            onCheckedChange={(checked) => 
              handleSelectChange("is_impulsive_exit", checked === true)
            }
          />
          <Label htmlFor="is_impulsive_exit">Impulsive Exit</Label>
        </div>
      </div>

      {!formData.followed_plan && (
        <div className="space-y-2">
          <Label htmlFor="plan_deviation_reason">Reason for Not Following Plan</Label>
          <Textarea
            id="plan_deviation_reason"
            name="plan_deviation_reason"
            value={formData.plan_deviation_reason}
            onChange={handleChange}
            placeholder="Why did you deviate from your trading plan?"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Trade Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add your trade notes..."
          className="h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chart_link">Chart Link</Label>
        <Input
          id="chart_link"
          name="chart_link"
          type="url"
          placeholder="TradingView chart link..."
          value={formData.chart_link}
          onChange={handleChange}
        />
      </div>
    </Card>
  );
}
