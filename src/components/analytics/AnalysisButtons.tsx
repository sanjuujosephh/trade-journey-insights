
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, TrendingUp, ShieldAlert, Lightbulb, Brain } from "lucide-react";
import { Trade } from "@/types/trade";

export interface AnalysisButtonsProps {
  isAnalyzing: boolean;
  trades: Trade[];
  onAnalyze: (days: number, customPrompt?: string) => Promise<void>;
  onAnalyzePerformance: () => Promise<void>;
  onAnalyzeRiskProfile: () => Promise<void>;
  onAnalyzeImprovements: () => Promise<void>;
  onAnalyzePsychology: () => Promise<void>;
}

export function AnalysisButtons({ 
  isAnalyzing, 
  trades,
  onAnalyze,
  onAnalyzePerformance,
  onAnalyzeRiskProfile,
  onAnalyzeImprovements,
  onAnalyzePsychology
}: AnalysisButtonsProps) {
  const noTrades = !trades || trades.length === 0;
  
  // Standard time period analysis handlers
  const handleAnalyze1Day = () => onAnalyze(1);
  const handleAnalyze7Days = () => onAnalyze(7);
  const handleAnalyze30Days = () => onAnalyze(30);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col xs:flex-row gap-2 w-full">
          <Button 
            onClick={handleAnalyze1Day} 
            disabled={isAnalyzing || noTrades}
            className="flex-1"
          >
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Last Day
          </Button>
          <Button 
            onClick={handleAnalyze7Days} 
            disabled={isAnalyzing || noTrades}
            className="flex-1"
          >
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Week
          </Button>
          <Button 
            onClick={handleAnalyze30Days} 
            disabled={isAnalyzing || noTrades}
            className="flex-1"
          >
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Month
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onAnalyzePerformance}
                  disabled={isAnalyzing || noTrades}
                  className="flex-1"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analyze your trading performance metrics in detail</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onAnalyzeRiskProfile}
                  disabled={isAnalyzing || noTrades}
                  className="flex-1"
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Risk Profile
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Evaluate your risk management and provide suggestions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onAnalyzeImprovements}
                  disabled={isAnalyzing || noTrades}
                  className="flex-1"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Improvements
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Identify areas of improvement in your trading strategy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onAnalyzePsychology}
                  disabled={isAnalyzing || noTrades}
                  className="flex-1"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Psychology
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analyze your trading psychology and emotional patterns</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
