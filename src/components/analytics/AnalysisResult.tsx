
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface AnalysisResultProps {
  currentAnalysis: string;
  isAnalyzing?: boolean;
}

export function AnalysisResult({ currentAnalysis, isAnalyzing = false }: AnalysisResultProps) {
  // Split analysis into sections based on common patterns in GPT output
  const sections = currentAnalysis?.split(/\n(?=[A-Z][^a-z]*:)/) || [];

  if (isAnalyzing) {
    return (
      <div className="bg-card border rounded-lg p-6 min-h-[400px] flex flex-col">
        <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
      
      {!currentAnalysis ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No analysis available yet.</p>
          <p className="text-sm mt-2">
            Run an analysis to see AI-generated insights about your trading.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {sections.map((section, index) => {
              const [title, ...content] = section.split('\n');
              return (
                <div key={index} className="space-y-2">
                  <h3 className="text-base font-semibold text-primary">
                    {title.trim()}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
