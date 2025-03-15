
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BarChart, Lightbulb, Brain } from "lucide-react";

interface AnalysisButtonsProps {
  onAnalyzePerformance: () => Promise<void>;
  onAnalyzeRiskProfile: () => Promise<void>;
  onAnalyzeImprovements: () => Promise<void>;
  onAnalyzePsychology: () => Promise<void>;
  isLoading: boolean;
}

export function AnalysisButtons({ 
  onAnalyzePerformance,
  onAnalyzeRiskProfile,
  onAnalyzeImprovements,
  onAnalyzePsychology,
  isLoading 
}: AnalysisButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="default"
        disabled={isLoading}
        onClick={onAnalyzePerformance}
      >
        <BarChart className="mr-2 h-4 w-4" />
        Performance Analysis
      </Button>

      <Button
        variant="outline"
        disabled={isLoading}
        onClick={onAnalyzeRiskProfile}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Risk Profile
      </Button>

      <Button
        variant="outline"
        disabled={isLoading}
        onClick={onAnalyzeImprovements}
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Improvement Suggestions
      </Button>

      <Button
        variant="outline"
        disabled={isLoading}
        onClick={onAnalyzePsychology}
      >
        <Brain className="mr-2 h-4 w-4" />
        Trading Psychology
      </Button>
    </div>
  );
}
