
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
import { AVAILABLE_STRATEGIES } from "@/constants/tradeConstants";
import { OptionPricePosition } from "./behavioral/OptionPricePosition";

interface MarketContextProps {
  formData: any;
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

      <div className="space-y-2">
        <Label htmlFor="strategy">Strategy</Label>
        <Select
          name="strategy"
          value={formData.strategy}
          onValueChange={(value) => handleSelectChange("strategy", value)}
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

      <div className="space-y-2">
        <OptionPricePosition 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
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
            value={formData.exit_emotion}
            onValueChange={(value) => handleSelectChange("exit_emotion", value)}
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

      <div className="space-y-2">
        <Label htmlFor="exit_reason">Exit Reason</Label>
        <Select
          name="exit_reason"
          value={formData.exit_reason}
          onValueChange={(value) => handleSelectChange("exit_reason", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exit reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stop_loss">Stop Loss</SelectItem>
            <SelectItem value="target">Target</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="time_based">Time Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Trade Notes</Label>
        <Input
          id="notes"
          name="notes"
          placeholder="Enter your trade notes here"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
    </Card>
  );
}
