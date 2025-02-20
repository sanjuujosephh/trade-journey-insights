
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionPricePosition } from "./behavioral/OptionPricePosition";

interface BehavioralAnalysisProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
}

export function BehavioralAnalysis({
  formData,
  handleChange,
  handleSelectChange,
}: BehavioralAnalysisProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trade_notes">Trade Notes</Label>
        <Input
          id="trade_notes"
          name="trade_notes"
          placeholder="Enter your trade notes here"
          value={formData.trade_notes}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <OptionPricePosition 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
        />
      </div>
    </Card>
  );
}
