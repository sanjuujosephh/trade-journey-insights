
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
}

export function AIAnalysisPanel({ isOpen, onClose, analysis }: AIAnalysisPanelProps) {
  // Split analysis into sections based on common patterns in GPT output
  const sections = analysis?.split(/\n(?=[A-Z][^a-z]*:)/) || [];

  return (
    <div
      className={cn(
        "fixed top-16 right-0 w-1/2 h-[calc(100vh-4rem)] bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Trading Analysis</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)] p-6">
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
    </div>
  );
}
