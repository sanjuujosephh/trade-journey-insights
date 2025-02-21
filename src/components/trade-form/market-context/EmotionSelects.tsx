
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmotionSelectsProps {
  entryEmotion: string;
  exitEmotion: string;
  onEntryEmotionChange: (value: string) => void;
  onExitEmotionChange: (value: string) => void;
}

export function EmotionSelects({
  entryEmotion,
  exitEmotion,
  onEntryEmotionChange,
  onExitEmotionChange,
}: EmotionSelectsProps) {
  return (
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
            <SelectItem value="fear">Fear</SelectItem>
            <SelectItem value="greed">Greed</SelectItem>
            <SelectItem value="fomo">FOMO</SelectItem>
            <SelectItem value="revenge">Revenge</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
