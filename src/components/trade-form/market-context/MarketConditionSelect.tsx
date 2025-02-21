
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketConditionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function MarketConditionSelect({ value, onValueChange }: MarketConditionSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="market_condition">Market Condition</Label>
      <Select
        name="market_condition"
        value={value}
        onValueChange={(value) => onValueChange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select market condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="trending">Trending</SelectItem>
          <SelectItem value="ranging">Ranging</SelectItem>
          <SelectItem value="volatile">Volatile</SelectItem>
          <SelectItem value="news_driven">News Driven</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
