
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, Info } from "lucide-react";
import { Trade } from "@/types/trade";
import { CustomPromptDialog } from "./CustomPromptDialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, subDays } from "date-fns";

interface AnalysisButtonsProps {
  isAnalyzing: boolean;
  trades: Trade[];
  onAnalyze: (options: { days?: number, customPrompt?: string }) => void;
}

export function AnalysisButtons({ isAnalyzing, trades, onAnalyze }: AnalysisButtonsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);

  const handleDayClick = (days: number) => {
    setSelectedPeriod(days);
    onAnalyze({ days });
  };

  const handleCustomPromptSubmit = (prompt: string) => {
    onAnalyze({ days: selectedPeriod, customPrompt: prompt });
  };

  // Count the valid trades for each time period
  const countValidTradesForPeriod = (days: number) => {
    if (!trades.length) return 0;
    
    const today = new Date();
    const startDate = subDays(today, days);
    
    return trades.filter(trade => {
      if (!trade.entry_date) return false;
      // Convert DD-MM-YYYY to a Date object
      const [day, month, year] = trade.entry_date.split('-').map(Number);
      const tradeDate = new Date(year, month - 1, day);
      return tradeDate >= startDate && tradeDate <= today;
    }).length;
  };

  const todayTrades = countValidTradesForPeriod(1);
  const weekTrades = countValidTradesForPeriod(7);
  const monthTrades = countValidTradesForPeriod(30);

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Trade Analysis</h3>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
                <span className="sr-only">What is AI Analysis?</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-4">
              <p>AI Analysis uses advanced algorithms to analyze your trading patterns, psychology, and market conditions to provide personalized insights and recommendations.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="text-sm text-muted-foreground pb-2">
          Analyze your trades with AI to uncover patterns, receive personalized recommendations, and improve your trading strategy.
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex">
            <Button 
              variant={selectedPeriod === 1 ? "default" : "outline"} 
              className="w-full flex justify-between items-center"
              disabled={isAnalyzing || todayTrades === 0}
              onClick={() => handleDayClick(1)}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Today's Trades</span>
              </div>
              <Badge variant="secondary" className="ml-2">{todayTrades}</Badge>
            </Button>
            <CustomPromptDialog 
              dayCount={1} 
              onAnalyze={handleCustomPromptSubmit} 
              trades={trades} 
            />
          </div>
          
          <div className="flex">
            <Button 
              variant={selectedPeriod === 7 ? "default" : "outline"} 
              className="w-full flex justify-between items-center"
              disabled={isAnalyzing || weekTrades === 0}
              onClick={() => handleDayClick(7)}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Past Week</span>
              </div>
              <Badge variant="secondary" className="ml-2">{weekTrades}</Badge>
            </Button>
            <CustomPromptDialog 
              dayCount={7} 
              onAnalyze={handleCustomPromptSubmit} 
              trades={trades} 
            />
          </div>
          
          <div className="flex">
            <Button 
              variant={selectedPeriod === 30 ? "default" : "outline"} 
              className="w-full flex justify-between items-center"
              disabled={isAnalyzing || monthTrades === 0}
              onClick={() => handleDayClick(30)}
            >
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Past Month</span>
              </div>
              <Badge variant="secondary" className="ml-2">{monthTrades}</Badge>
            </Button>
            <CustomPromptDialog 
              dayCount={30} 
              onAnalyze={handleCustomPromptSubmit} 
              trades={trades} 
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
