
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Trade } from "@/types/trade";
import { CustomPromptDialog } from "./CustomPromptDialog";

interface AnalysisButtonsProps {
  isAnalyzing: boolean;
  trades: Trade[];
  onAnalyze: (days: number, customPrompt?: string) => void;
}

export function AnalysisButtons({ isAnalyzing, trades, onAnalyze }: AnalysisButtonsProps) {
  const handleAnalyze = (days: number) => {
    onAnalyze(days);
  };

  const handleCustomAnalyze = (days: number) => (customPrompt: string) => {
    onAnalyze(days, customPrompt);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-end gap-4 my-6">
      <Button
        onClick={() => handleAnalyze(1)}
        disabled={isAnalyzing || trades.length === 0}
        className="w-full md:w-auto"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Today's Trades...
          </>
        ) : (
          <>Analyze Today's Trades (1 Credit)</>
        )}
      </Button>
      
      <CustomPromptDialog dayCount={1} onAnalyze={handleCustomAnalyze(1)} />
      
      <Button
        onClick={() => handleAnalyze(7)}
        disabled={isAnalyzing || trades.length === 0}
        className="w-full md:w-auto"
      >
        Analyze Last 7 Days' Trades (3 Credits)
      </Button>
      
      <CustomPromptDialog dayCount={7} onAnalyze={handleCustomAnalyze(7)} />
      
      <Button
        onClick={() => handleAnalyze(30)}
        disabled={isAnalyzing || trades.length === 0}
        className="w-full md:w-auto"
      >
        Analyze This Month's Trades (5 Credits)
      </Button>
      
      <CustomPromptDialog dayCount={30} onAnalyze={handleCustomAnalyze(30)} />
    </div>
  );
}
