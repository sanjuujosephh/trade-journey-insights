import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_SYMBOLS } from "@/constants/tradeConstants";
import { useToast } from "@/hooks/use-toast";
import { OptionsFields } from "./basic-info/OptionsFields";
import { TimeFields } from "./basic-info/TimeFields";
interface BasicTradeInfoProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}
export function BasicTradeInfo({
  formData,
  handleChange,
  handleSelectChange
}: BasicTradeInfoProps) {
  const {
    toast
  } = useToast();
  return <Card className="p-6 space-y-4 glass">
      <div className="space-y-2">
        <Label htmlFor="symbol">Symbol</Label>
        <Select name="symbol" value={formData.symbol} onValueChange={value => handleSelectChange("symbol", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SYMBOLS.map(symbol => <SelectItem key={symbol} value={symbol}>
                {symbol}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground">Select the stock or index you're trading</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trade_type">Trade Type</Label>
          <Input id="trade_type" name="trade_type" value="Options" readOnly className="bg-gray-100" />
          <div className="text-xs text-muted-foreground">Currently limited to options trading</div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trade_direction">Direction</Label>
          <Select name="trade_direction" value={formData.trade_direction} onValueChange={value => handleSelectChange("trade_direction", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">Long (bullish) or Short (bearish) position</div>
        </div>
      </div>

      <OptionsFields formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_price">Entry Price</Label>
          <Input id="entry_price" name="entry_price" type="number" step="0.01" placeholder="0.00" value={formData.entry_price} onChange={handleChange} required />
          <div className="text-xs text-muted-foreground">Price at which you entered</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_price">Exit Price</Label>
          <Input id="exit_price" name="exit_price" type="number" step="0.01" placeholder="0.00" value={formData.exit_price} onChange={handleChange} />
          <div className="text-xs text-muted-foreground">Price at which you exited</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stop_loss">Stop Loss</Label>
          <Input id="stop_loss" name="stop_loss" type="number" step="0.01" placeholder="0.00" value={formData.stop_loss} onChange={handleChange} />
          <div className="text-xs text-muted-foreground">Pre-determined limit loss</div>
        </div>
      </div>

      <TimeFields formData={formData} handleChange={handleChange} />

      <div className="space-y-2">
        <Label htmlFor="chart_link">TradingView Chart Link</Label>
        <Input id="chart_link" name="chart_link" type="url" placeholder="https://www.tradingview.com/chart/..." value={formData.chart_link} onChange={handleChange} />
        <div className="text-xs text-muted-foreground">Link to your TradingView chart for this trade</div>
      </div>
    </Card>;
}