
import { Card } from "@/components/ui/card";
import { OptionPricePosition } from "./behavioral/OptionPricePosition";
import { RiskRewardMetrics } from "./behavioral/RiskRewardMetrics";
import { ExitMetrics } from "./behavioral/ExitMetrics";
import { EmotionalAnalysis } from "./behavioral/EmotionalAnalysis";
import { PlanAdherence } from "./behavioral/PlanAdherence";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OptionPricePosition 
          formData={formData} 
          handleSelectChange={handleSelectChange} 
        />
        <ExitMetrics 
          formData={formData} 
          handleChange={handleChange} 
          handleSelectChange={handleSelectChange} 
        />
      </div>

      <RiskRewardMetrics 
        formData={formData} 
        handleChange={handleChange} 
      />

      <EmotionalAnalysis 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange} 
      />

      <PlanAdherence 
        formData={formData} 
        handleChange={handleChange} 
        handleSelectChange={handleSelectChange} 
      />
    </Card>
  );
}
