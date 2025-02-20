
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OptionPricePositionProps {
  formData: any;
  handleSelectChange: (name: string, value: string) => void;
}

export function OptionPricePosition({
  formData,
  handleSelectChange,
}: OptionPricePositionProps) {
  return (
    <div className="space-y-2">
      <Label>Option Price Was</Label>
      <div className="space-y-2">
        <Select
          name="vwap_position"
          value={formData.vwap_position}
          onValueChange={(value) => handleSelectChange("vwap_position", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select VWAP Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above_vwap">Above VWAP</SelectItem>
            <SelectItem value="below_vwap">Below VWAP</SelectItem>
          </SelectContent>
        </Select>
        <Select
          name="ema_position"
          value={formData.ema_position}
          onValueChange={(value) => handleSelectChange("ema_position", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select 20 EMA Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="above_20ema">Above 20 EMA</SelectItem>
            <SelectItem value="below_20ema">Below 20 EMA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
