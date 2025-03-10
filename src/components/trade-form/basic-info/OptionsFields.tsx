
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OptionsFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function OptionsFields({
  formData,
  handleChange,
  handleSelectChange,
}: OptionsFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="text-xs text-muted-foreground">⚠︎ Price at which option can be exercised</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="1"
            placeholder="0"
            value={formData.quantity}
            onChange={handleChange}
          />
          <div className="text-xs text-muted-foreground">⚠︎ Number of contracts traded</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="option_type">Option Type</Label>
          <Select
            name="option_type"
            value={formData.option_type}
            onValueChange={(value) => handleSelectChange("option_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="put">Put</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">⚠︎ Call (right to buy) or Put (right to sell)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vix">VIX</Label>
          <Input
            id="vix"
            name="vix"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.vix}
            onChange={handleChange}
          />
          <div className="text-xs text-muted-foreground">⚠︎ Market volatility index value at entry</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="call_iv">Call IV</Label>
          <Input
            id="call_iv"
            name="call_iv"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.call_iv}
            onChange={handleChange}
          />
          <div className="text-xs text-muted-foreground">⚠︎ Implied volatility for call options (%)</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="put_iv">Put IV</Label>
          <Input
            id="put_iv"
            name="put_iv"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.put_iv}
            onChange={handleChange}
          />
          <div className="text-xs text-muted-foreground">⚠︎ Implied volatility for put options (%)</div>
        </div>
      </div>
    </>
  );
}
