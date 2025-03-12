
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Trade } from "@/types/trade";

interface AnalysisButtonsProps {
  isAnalyzing: boolean;
  trades: Trade[];
  onAnalyze: (days: number) => void;
}

export function AnalysisButtons({ isAnalyzing, trades, onAnalyze }: AnalysisButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-end gap-4 my-6">
      <Button
        onClick={() => onAnalyze(1)}
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
      <Button
        onClick={() => onAnalyze(7)}
        disabled={isAnalyzing || trades.length === 0}
        className="w-full md:w-auto"
      >
        Analyze Last 7 Days' Trades (3 Credits)
      </Button>
      <Button
        onClick={() => onAnalyze(30)}
        disabled={isAnalyzing || trades.length === 0}
        className="w-full md:w-auto"
      >
        Analyze This Month's Trades (5 Credits)
      </Button>
    </div>
  );
}
