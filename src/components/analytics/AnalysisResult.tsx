
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisResultProps {
  currentAnalysis: string;
  isAnalyzing?: boolean;
  onClear?: () => void;
}

export function AnalysisResult({ currentAnalysis, isAnalyzing = false, onClear }: AnalysisResultProps) {
  // Split analysis into sections based on common patterns in GPT output
  const sections = currentAnalysis?.split(/\n(?=[A-Z][^a-z]*:)/) || [];

  if (isAnalyzing) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">AI Analysis</CardTitle>
        {onClear && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
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
      </CardContent>
    </Card>
  );
}
