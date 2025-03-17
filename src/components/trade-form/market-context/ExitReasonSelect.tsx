
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExitReasonSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ExitReasonSelect({ value, onValueChange }: ExitReasonSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="exit_reason">Exit Reason</Label>
      <Select
        name="exit_reason"
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select exit reason" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stop_loss">Stop Loss</SelectItem>
          <SelectItem value="target_reached">Target</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="time_based">Time Based</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
