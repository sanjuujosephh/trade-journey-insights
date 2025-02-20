
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmotionalAnalysisProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function EmotionalAnalysis({
  formData,
  handleChange,
  handleSelectChange,
}: EmotionalAnalysisProps) {
  return (
    <>
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
    </>
  );
}
