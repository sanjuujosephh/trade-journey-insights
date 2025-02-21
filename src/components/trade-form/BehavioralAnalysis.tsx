
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 space-y-4 glass"></Card>
  );
}
