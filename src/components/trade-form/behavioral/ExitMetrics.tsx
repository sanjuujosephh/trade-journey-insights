
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExitMetricsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function ExitMetrics({
  formData,
  handleChange,
  handleSelectChange,
}: ExitMetricsProps) {
  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="post_exit_price">Post Exit Price</Label>
          <Input
            id="post_exit_price"
            name="post_exit_price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.post_exit_price}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exit_efficiency">Exit Efficiency (%)</Label>
          <Input
            id="exit_efficiency"
            name="exit_efficiency"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.exit_efficiency}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
