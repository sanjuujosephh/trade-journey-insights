
import { Card } from "@/components/ui/card";
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
    <Card className="p-6 space-y-4 glass">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_emotion">Entry Emotion</Label>
          <Select
            name="entry_emotion"
            value={formData.entry_emotion}
            onValueChange={(value) => handleSelectChange("entry_emotion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entry emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confident">Confident</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="fearful">Fearful</SelectItem>
              <SelectItem value="greedy">Greedy</SelectItem>
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
              <SelectValue placeholder="Select exit emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="satisfied">Satisfied</SelectItem>
              <SelectItem value="regretful">Regretful</SelectItem>
              <SelectItem value="relieved">Relieved</SelectItem>
              <SelectItem value="frustrated">Frustrated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="followed_plan"
            checked={formData.followed_plan}
            onCheckedChange={(value) => handleSelectChange("followed_plan", value)}
          />
          <Label htmlFor="followed_plan">Followed Trading Plan</Label>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_fomo_trade"
            checked={formData.is_fomo_trade}
            onCheckedChange={(value) => handleSelectChange("is_fomo_trade", value)}
          />
          <Label htmlFor="is_fomo_trade">FOMO Trade</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_impulsive_exit"
            checked={formData.is_impulsive_exit}
            onCheckedChange={(value) => handleSelectChange("is_impulsive_exit", value)}
          />
          <Label htmlFor="is_impulsive_exit">Impulsive Exit</Label>
        </div>
      </div>
    </Card>
  );
}
