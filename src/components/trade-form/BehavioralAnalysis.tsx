import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BehavioralAnalysisProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
}

export function BehavioralAnalysis({
  formData,
  handleChange,
  handleSelectChange,
}: BehavioralAnalysisProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Was Option Price</Label>
          <div className="space-y-2">
            <Select
              name="vwap_position"
              value={formData.vwap_position}
              onValueChange={(value) => handleSelectChange("vwap_position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select VWAP Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above_vwap">Above VWAP</SelectItem>
                <SelectItem value="below_vwap">Below VWAP</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="ema_position"
              value={formData.ema_position}
              onValueChange={(value) => handleSelectChange("ema_position", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select 20 EMA Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above_20ema">Above 20 EMA</SelectItem>
                <SelectItem value="below_20ema">Below 20 EMA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exit_reason">Exit Reason</Label>
          <Select
            name="exit_reason"
            value={formData.exit_reason}
            onValueChange={(value) => handleSelectChange("exit_reason", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exit reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stop_loss">Stop Loss</SelectItem>
              <SelectItem value="target">Target</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="time_based">Time Based</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="post_exit_price">Post Exit Price</Label>
          <Input
            id="post_exit_price"
            name="post_exit_price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.post_exit_price}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_efficiency">Exit Efficiency (%)</Label>
          <Input
            id="exit_efficiency"
            name="exit_efficiency"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.exit_efficiency}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confidence_level">Confidence Level (1-10)</Label>
        <Input
          id="confidence_level"
          name="confidence_level"
          type="number"
          min="1"
          max="10"
          placeholder="1-10"
          value={formData.confidence_level}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_emotion">Entry Emotion</Label>
          <Select
            name="entry_emotion"
            value={formData.entry_emotion}
            onValueChange={(value) => handleSelectChange("entry_emotion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fear">Fear</SelectItem>
              <SelectItem value="greed">Greed</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_emotion">Exit Emotion</Label>
          <Select
            name="exit_emotion"
            value={formData.exit_emotion}
            onValueChange={(value) => handleSelectChange("exit_emotion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fear">Fear</SelectItem>
              <SelectItem value="greed">Greed</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
    </Card>
  );
}
