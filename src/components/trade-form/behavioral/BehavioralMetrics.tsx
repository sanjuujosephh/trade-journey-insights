import { FormData } from "@/types/trade";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
interface BehavioralMetricsProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
}
export function BehavioralMetrics({
  formData,
  handleChange,
  handleSelectChange
}: BehavioralMetricsProps) {
  const [stressLevel, setStressLevel] = useState<number>(formData.stress_level ? Number(formData.stress_level) : 5);
  const [satisfactionScore, setSatisfactionScore] = useState<number>(formData.satisfaction_score ? Number(formData.satisfaction_score) : 5);
  const handleStressLevelChange = (value: number[]) => {
    const level = value[0];
    setStressLevel(level);
    handleSelectChange("stress_level", String(level));
  };
  const handleSatisfactionScoreChange = (value: number[]) => {
    const score = value[0];
    setSatisfactionScore(score);
    handleSelectChange("satisfaction_score", String(score));
  };
  return <div className="space-y-4 pt-2">
      
      
      <div className="flex items-center justify-between">
        <Label htmlFor="is_impulsive" className="text-sm">Was this an impulse trade?</Label>
        <Switch id="is_impulsive" checked={formData.is_impulsive} onCheckedChange={checked => handleSelectChange("is_impulsive", checked)} />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="plan_deviation" className="text-sm">Did you deviate from your trading plan?</Label>
        <Switch id="plan_deviation" checked={formData.plan_deviation} onCheckedChange={checked => handleSelectChange("plan_deviation", checked)} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stress_level" className="text-sm">Stress Level: {stressLevel} / 10</Label>
        <Slider id="stress_level" min={1} max={10} step={1} value={[stressLevel]} onValueChange={handleStressLevelChange} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="satisfaction_score" className="text-sm">Trade Satisfaction: {satisfactionScore} / 10</Label>
        <Slider id="satisfaction_score" min={1} max={10} step={1} value={[satisfactionScore]} onValueChange={handleSatisfactionScoreChange} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time_pressure" className="text-sm">Time Pressure Level</Label>
        <Select value={formData.time_pressure} onValueChange={value => handleSelectChange("time_pressure", value)}>
          <SelectTrigger id="time_pressure">
            <SelectValue placeholder="Select time pressure level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (Had plenty of time to analyze)</SelectItem>
            <SelectItem value="medium">Medium (Somewhat rushed)</SelectItem>
            <SelectItem value="high">High (Very rushed decision)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>;
}