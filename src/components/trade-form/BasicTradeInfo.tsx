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
import { AVAILABLE_SYMBOLS } from "@/components/TradeEntry";
import { useToast } from "@/hooks/use-toast";

interface BasicTradeInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function BasicTradeInfo({ formData, handleChange, handleSelectChange }: BasicTradeInfoProps) {
  const { toast } = useToast();

  const getDateString = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    return dateTimeStr.split('T')[0];
  };

  const formatTimeForInput = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [datePart, timePart] = value.split('T');
    
    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const marketOpenTime = 9 * 60 + 15;  // 9:15 AM
      const marketCloseTime = 15 * 60 + 25; // 3:25 PM
      
      let adjustedTime = value;
      if (timeInMinutes < marketOpenTime) {
        adjustedTime = `${datePart}T${formatTimeForInput(9, 15)}`;
        toast({
          description: "Time adjusted to market opening hours (9:15 AM)",
        });
      } else if (timeInMinutes > marketCloseTime) {
        adjustedTime = `${datePart}T${formatTimeForInput(15, 25)}`;
        toast({
          description: "Time adjusted to market closing hours (3:25 PM)",
        });
      }
      
      const syntheticEvent = {
        target: { name, value: adjustedTime }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(syntheticEvent);
      return;
    }
    
    handleChange(e);
  };

  const timeStep = 60; // 60 seconds = 1 minute

  return (
    <Card className="p-6 space-y-4 glass">
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Select
          name="symbol"
          value={formData.symbol}
          onValueChange={(value) => handleSelectChange("symbol", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SYMBOLS.map((symbol) => (
              <SelectItem key={symbol} value={symbol}>
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trade_type">Trade Type</Label>
          <Select
            name="trade_type"
            value={formData.trade_type}
            onValueChange={(value) => handleSelectChange("trade_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="options">Options</SelectItem>
              <SelectItem value="futures">Futures</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trade_direction">Direction</Label>
          <Select
            name="trade_direction"
            value={formData.trade_direction}
            onValueChange={(value) => handleSelectChange("trade_direction", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.trade_type === "options" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="strike_price">Strike Price</Label>
            <Input
              id="strike_price"
              name="strike_price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.strike_price}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="option_type">Option Type</Label>
            <Select
              name="option_type"
              value={formData.option_type}
              onValueChange={(value) => handleSelectChange("option_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="put">Put</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_price">Entry Price</Label>
          <Input
            id="entry_price"
            name="entry_price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.entry_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_price">Exit Price</Label>
          <Input
            id="exit_price"
            name="exit_price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.exit_price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_time">Entry Time</Label>
          <Input
            id="entry_time"
            name="entry_time"
            type="datetime-local"
            min={`${getDateString(formData.entry_time)}T09:15`}
            max={`${getDateString(formData.entry_time)}T15:25`}
            step={timeStep}
            value={formData.entry_time}
            onChange={handleTimeChange}
            onKeyDown={(e) => e.preventDefault()}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_time">Exit Time</Label>
          <Input
            id="exit_time"
            name="exit_time"
            type="datetime-local"
            min={`${getDateString(formData.exit_time)}T09:15`}
            max={`${getDateString(formData.exit_time)}T15:25`}
            step={timeStep}
            value={formData.exit_time}
            onChange={handleTimeChange}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </Card>
  );
}
