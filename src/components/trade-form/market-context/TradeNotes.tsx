
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TradeNotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TradeNotes({ value, onChange }: TradeNotesProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Trade Notes</Label>
      <Input
        id="notes"
        name="notes"
        placeholder="Enter your trade notes here"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
