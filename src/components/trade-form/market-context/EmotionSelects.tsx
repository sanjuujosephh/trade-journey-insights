
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface EmotionSelectsProps {
  entryEmotion: string;
  exitEmotion: string;
  confidenceLevel: string;
  satisfactionScore: string;
  isImpulsive: boolean;
  planDeviation: boolean;
  onEntryEmotionChange: (value: string) => void;
  onExitEmotionChange: (value: string) => void;
  onConfidenceLevelChange: (value: string) => void;
  onSatisfactionScoreChange: (value: string) => void;
  onIsImpulsiveChange: (value: boolean) => void;
  onPlanDeviationChange: (value: boolean) => void;
}

export function EmotionSelects({
  entryEmotion,
  exitEmotion,
  confidenceLevel,
  satisfactionScore,
  isImpulsive,
  planDeviation,
  onEntryEmotionChange,
  onExitEmotionChange,
  onConfidenceLevelChange,
  onSatisfactionScoreChange,
  onIsImpulsiveChange,
  onPlanDeviationChange,
}: EmotionSelectsProps) {
  const [confidence, setConfidence] = useState(confidenceLevel ? parseInt(confidenceLevel) : 5);
  const [satisfaction, setSatisfaction] = useState(satisfactionScore ? parseInt(satisfactionScore) : 5);
  
  const handleConfidenceChange = (value: number[]) => {
    setConfidence(value[0]);
    onConfidenceLevelChange(value[0].toString());
  };
  
  const handleSatisfactionChange = (value: number[]) => {
    setSatisfaction(value[0]);
    onSatisfactionScoreChange(value[0].toString());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_emotion">Entry Emotion</Label>
          <Select
            name="entry_emotion"
            value={entryEmotion}
            onValueChange={onEntryEmotionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entry emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fear">Fear</SelectItem>
              <SelectItem value="greed">Greed</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="confident">Confident</SelectItem>
              <SelectItem value="anxious">Anxious</SelectItem>
              <SelectItem value="excited">Excited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exit_emotion">Exit Emotion</Label>
          <Select
            name="exit_emotion"
            value={exitEmotion}
            onValueChange={onExitEmotionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exit emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="satisfied">Satisfied</SelectItem>
              <SelectItem value="regretful">Regretful</SelectItem>
              <SelectItem value="relieved">Relieved</SelectItem>
              <SelectItem value="frustrated">Frustrated</SelectItem>
              <SelectItem value="excited">Excited</SelectItem>
              <SelectItem value="disappointed">Disappointed</SelectItem>
              <SelectItem value="indifferent">Indifferent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="confidence_level">Pre-Trade Confidence (1-10)</Label>
            <span className="text-sm font-medium">{confidence}</span>
          </div>
          <Slider 
            id="confidence_level"
            defaultValue={[confidence]} 
            max={10} 
            min={1} 
            step={1} 
            onValueChange={handleConfidenceChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="satisfaction_score">Post-Trade Satisfaction (1-10)</Label>
            <span className="text-sm font-medium">{satisfaction}</span>
          </div>
          <Slider 
            id="satisfaction_score"
            defaultValue={[satisfaction]} 
            max={10} 
            min={1} 
            step={1} 
            onValueChange={handleSatisfactionChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="is_impulsive" 
            checked={isImpulsive} 
            onCheckedChange={onIsImpulsiveChange} 
          />
          <Label htmlFor="is_impulsive">Impulsive Trade</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="plan_deviation" 
            checked={planDeviation} 
            onCheckedChange={onPlanDeviationChange} 
          />
          <Label htmlFor="plan_deviation">Deviated from Plan</Label>
        </div>
      </div>
    </div>
  );
}
