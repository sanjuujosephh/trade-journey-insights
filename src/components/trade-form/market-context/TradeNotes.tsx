
import { Label } from "@/components/ui/label";

interface TradeNotesProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TradeNotes({
  value,
  onChange
}: TradeNotesProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Explain Trade + Trade Notes</Label>
      <textarea 
        id="notes" 
        name="notes" 
        placeholder="Enter your trade notes here" 
        value={value} 
        onChange={onChange}
        className="flex h-24 w-full rounded-[3px] border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    </div>
  );
}
