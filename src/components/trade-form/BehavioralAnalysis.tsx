
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const emotionOptions = [
    { value: "fear", label: "Fear" },
    { value: "greed", label: "Greed" },
    { value: "fomo", label: "FOMO" },
    { value: "revenge", label: "Revenge" },
    { value: "neutral", label: "Neutral" },
  ];

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Behavioral Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="entry_emotion">Entry Emotion</Label>
          <Select
            value={formData.entry_emotion}
            onValueChange={(value) => handleSelectChange("entry_emotion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entry emotion" />
            </SelectTrigger>
            <SelectContent>
              {emotionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exit_emotion">Exit Emotion</Label>
          <Select
            value={formData.exit_emotion}
            onValueChange={(value) => handleSelectChange("exit_emotion", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select exit emotion" />
            </SelectTrigger>
            <SelectContent>
              {emotionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
