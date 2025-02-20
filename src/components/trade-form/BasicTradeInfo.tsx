
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
import { useEffect, useState } from "react";

interface BasicTradeInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function BasicTradeInfo({ formData, handleChange, handleSelectChange }: BasicTradeInfoProps) {
  const { toast } = useToast();
  const [entryDate, setEntryDate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [exitTime, setExitTime] = useState("");

  useEffect(() => {
    if (formData.entry_time) {
      const date = new Date(formData.entry_time);
      setEntryDate(date.toLocaleDateString('en-US'));
      setEntryTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }
    if (formData.exit_time) {
      const date = new Date(formData.exit_time);
      setExitDate(date.toLocaleDateString('en-US'));
      setExitTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }
  }, [formData.entry_time, formData.exit_time]);

  const validateTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const marketOpenTime = 9 * 60 + 15;  // 9:15 AM
    const marketCloseTime = 15 * 60 + 25; // 3:25 PM

    if (timeInMinutes < marketOpenTime) {
      return "09:15";
    } else if (timeInMinutes > marketCloseTime) {
      return "15:25";
    }
    return timeStr;
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEntry: boolean) => {
    const { value } = e.target;
    const [dateStr, timeStr] = value.split('T');
    
    if (timeStr) {
      const validatedTime = validateTime(timeStr);
      if (validatedTime !== timeStr) {
        toast({
          description: `Time adjusted to market ${timeStr < "09:15" ? "opening" : "closing"} hours`,
        });
      }
      
      const newDateTime = `${dateStr}T${validatedTime}`;
      const syntheticEvent = {
        target: {
          name: isEntry ? "entry_time" : "exit_time",
          value: newDateTime
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(syntheticEvent);
    }
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
          <Input
            id="entry_time"
            name="entry_time"
            type="datetime-local"
            value={formData.entry_time}
            onChange={(e) => handleTimeInputChange(e, true)}
            min={`${formData.entry_time?.split('T')[0] || new Date().toISOString().split('T')[0]}T09:15`}
            max={`${formData.entry_time?.split('T')[0] || new Date().toISOString().split('T')[0]}T15:25`}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_time">Exit Time</Label>
          <Input
            id="exit_time"
            name="exit_time"
            type="datetime-local"
            value={formData.exit_time}
            onChange={(e) => handleTimeInputChange(e, false)}
            min={`${formData.exit_time?.split('T')[0] || new Date().toISOString().split('T')[0]}T09:15`}
            max={`${formData.exit_time?.split('T')[0] || new Date().toISOString().split('T')[0]}T15:25`}
          />
        </div>
      </div>
    </Card>
  );
}
