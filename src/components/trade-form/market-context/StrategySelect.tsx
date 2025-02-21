
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_STRATEGIES } from "@/constants/tradeConstants";

interface StrategySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function StrategySelect({ value, onValueChange }: StrategySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="strategy">Strategy</Label>
      <Select
        name="strategy"
        value={value}
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_STRATEGIES.map((strategy) => (
            <SelectItem key={strategy} value={strategy}>
              {strategy}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
