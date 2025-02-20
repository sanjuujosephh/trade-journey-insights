
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

interface MarketContextProps {
  formData: {
    market_condition: string;
    timeframe: string;
    confidence_level: string;
    entry_emotion: string;
    exit_emotion: string;
    stop_loss: string;
    planned_target: string;
    exit_reason: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function MarketContext({
  formData,
  handleChange,
  handleSelectChange,
}: MarketContextProps) {
  return (
    <Card className="p-6 space-y-4 glass">
      <div className="space-y-2">
        <Label htmlFor="market_condition">Market Condition</Label>
        <Select
          name="market_condition"
          value={formData.market_condition}
          onValueChange={(value) => handleSelectChange("market_condition", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="ranging">Ranging</SelectItem>
            <SelectItem value="news_driven">News Driven</SelectItem>
            <SelectItem value="volatile">Volatile</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select
            name="timeframe"
            value={formData.timeframe}
            onValueChange={(value) => handleSelectChange("timeframe", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1min">1 min</SelectItem>
              <SelectItem value="5min">5 min</SelectItem>
              <SelectItem value="15min">15 min</SelectItem>
              <SelectItem value="1hr">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confidence_level">Confidence Level</Label>
          <Select
            name="confidence_level"
            value={formData.confidence_level}
            onValueChange={(value) => handleSelectChange("confidence_level", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level}/5
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="fear">Fear</SelectItem>
              <SelectItem value="greed">Greed</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
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
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="fear">Fear</SelectItem>
              <SelectItem value="greed">Greed</SelectItem>
              <SelectItem value="fomo">FOMO</SelectItem>
              <SelectItem value="revenge">Revenge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stop_loss">Stop Loss</Label>
          <Input
            id="stop_loss"
            name="stop_loss"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.stop_loss}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="planned_target">Target</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="exit_reason">Exit Reason</Label>
        <Select
          name="exit_reason"
          value={formData.exit_reason}
          onValueChange={(value) => handleSelectChange("exit_reason", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="target">Hit Target</SelectItem>
            <SelectItem value="stop_loss">Stop Loss</SelectItem>
            <SelectItem value="manual">Manual Exit</SelectItem>
            <SelectItem value="time_based">Time Based</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
