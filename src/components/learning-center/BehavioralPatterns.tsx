
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface BehavioralPattern {
  pattern: string;
  detection: number;
  suggestion: string;
}

interface BehavioralPatternsProps {
  patterns: BehavioralPattern[];
}

export function BehavioralPatterns({ patterns }: BehavioralPatternsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Trading Psychology Analysis</h3>
      <div className="space-y-3">
        {patterns.map((pattern) => (
          <Alert key={pattern.pattern} className={pattern.detection > 0 ? "border-destructive" : ""}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{pattern.pattern}</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex justify-between items-center">
                <span>
                  Detected {pattern.detection} times in your trading history
                </span>
                <span className={`text-sm ${
                  pattern.detection > 0 ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {pattern.suggestion}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
