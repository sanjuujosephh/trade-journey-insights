
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

  const generateTimeOptions = () => {
    const options = [];
    let currentTime = 9 * 60 + 15; // Start at 9:15 AM
    const endTime = 15 * 60 + 25; // End at 3:25 PM

    while (currentTime <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours;
      const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      options.push({
        value: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        label: timeString
      });
      currentTime += 1; // Add 1 minute
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleDateTimeChange = (type: 'entry' | 'exit', timeStr: string) => {
    const currentDate = formData[`${type}_time`]?.split('T')[0] || new Date().toISOString().split('T')[0];
    const newDateTime = `${currentDate}T${timeStr}`;
    
    const syntheticEvent = {
      target: {
        name: `${type}_time`,
        value: newDateTime
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

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
          <div className="flex gap-4">
            <Input
              type="date"
              value={formData.entry_time?.split('T')[0] || ''}
              onChange={(e) => {
                const timeStr = formData.entry_time?.split('T')[1] || '09:15';
                const newDateTime = `${e.target.value}T${timeStr}`;
                handleChange({
                  target: { name: 'entry_time', value: newDateTime }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              required
            />
            <Select
              value={formData.entry_time?.split('T')[1] || ''}
              onValueChange={(value) => handleDateTimeChange('entry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="h-[200px] overflow-y-auto">
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_time">Exit Time</Label>
          <div className="flex gap-4">
            <Input
              type="date"
              value={formData.exit_time?.split('T')[0] || ''}
              onChange={(e) => {
                const timeStr = formData.exit_time?.split('T')[1] || '09:15';
                const newDateTime = `${e.target.value}T${timeStr}`;
                handleChange({
                  target: { name: 'exit_time', value: newDateTime }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            <Select
              value={formData.exit_time?.split('T')[1] || ''}
              onValueChange={(value) => handleDateTimeChange('exit', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="h-[200px] overflow-y-auto">
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
