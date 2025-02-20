
import { Card } from "@/components/ui/card";
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
      <OptionPricePosition 
        formData={formData} 
        handleSelectChange={handleSelectChange} 
      />
    </Card>
  );
}
