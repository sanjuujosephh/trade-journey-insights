
import { Card } from "@/components/ui/card";

interface AnalysisResultProps {
  currentAnalysis: string;
}

export function AnalysisResult({ currentAnalysis }: AnalysisResultProps) {
  return (
    <Card className="p-2 sm:p-4 md:p-6 mb-6">
      {currentAnalysis ? (
        <p className="whitespace-pre-wrap text-sm md:text-base">{currentAnalysis}</p>
      ) : (
        <p className="text-muted-foreground text-sm md:text-base">
          Select an analysis option above to get AI insights about your trades.
        </p>
      )}
    </Card>
  );
}
