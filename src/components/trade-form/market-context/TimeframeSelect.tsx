
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeframeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeframeSelect({ value, onValueChange }: TimeframeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="timeframe">Timeframe</Label>
      <Select
        name="timeframe"
        value={value}
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1min">1 Minute</SelectItem>
          <SelectItem value="3min">3 Minutes</SelectItem>
          <SelectItem value="5min">5 Minutes</SelectItem>
          <SelectItem value="15min">15 Minutes</SelectItem>
          <SelectItem value="1hr">1 Hour</SelectItem>
          <SelectItem value="4hr">4 Hours</SelectItem>
          <SelectItem value="1day">1 Day</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
