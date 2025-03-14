
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { CustomPromptDialog } from "./CustomPromptDialog";
import { useState } from "react";
import { Trade } from "@/types/trade";

interface AnalysisButtonsProps {
  isAnalyzing: boolean;
  trades: Trade[];
  onAnalyze: (days: number, customPrompt?: string) => void;
}

export function AnalysisButtons({ isAnalyzing, trades, onAnalyze }: AnalysisButtonsProps) {
  const [selectedDayCount, setSelectedDayCount] = useState<number>(0);
  
  const handleSelectDayCount = (days: number) => {
    setSelectedDayCount(days);
    onAnalyze(days);
  };
  
  const handleCustomPromptAnalysis = (customPrompt: string) => {
    onAnalyze(selectedDayCount || 1, customPrompt);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex">
        <Button
          variant="default"
          className="rounded-r-none"
          disabled={isAnalyzing}
          onClick={() => handleSelectDayCount(1)}
        >
          <Clock className="mr-2 h-4 w-4" />
          Today's Trades
        </Button>
        <CustomPromptDialog 
          dayCount={1} 
          onAnalyze={handleCustomPromptAnalysis}
          trades={trades}
        />
      </div>

      <div className="flex">
        <Button
          variant="outline"
          className="rounded-r-none"
          disabled={isAnalyzing}
          onClick={() => handleSelectDayCount(7)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Last 7 Days
        </Button>
        <CustomPromptDialog 
          dayCount={7} 
          onAnalyze={handleCustomPromptAnalysis}
          trades={trades}
        />
      </div>

      <div className="flex">
        <Button
          variant="outline"
          className="rounded-r-none"
          disabled={isAnalyzing}
          onClick={() => handleSelectDayCount(30)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Last 30 Days
        </Button>
        <CustomPromptDialog 
          dayCount={30} 
          onAnalyze={handleCustomPromptAnalysis}
          trades={trades}
        />
      </div>
    </div>
  );
}
