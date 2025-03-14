
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Info, Wand2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PromptVariableValues } from "./PromptVariableValues";
import { Trade } from "@/types/trade";

interface CustomPromptDialogProps {
  dayCount: number;
  onAnalyze: (customPrompt: string) => void;
  trades: Trade[];
}

export function CustomPromptDialog({ dayCount, onAnalyze, trades }: CustomPromptDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const handleAnalyze = () => {
    onAnalyze(customPrompt);
    setIsOpen(false);
  };

  const defaultPrompt = `As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: {{totalTrades}}
- Win Rate: {{winRate}}%
- Total P&L: {{totalPnL}}
- Average Trade P&L: {{avgTradePnL}}
- Profit Factor: {{profitFactor}}

Strategy Performance:
{{strategyPerformance}}

Market Conditions:
{{marketConditionPerformance}}

Emotional Analysis:
{{emotionAnalysis}}

Time Analysis:
{{timeAnalysis}}

Position Sizing:
{{positionSizing}}

Risk Management:
{{riskMetrics}}

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement
5. How emotions are affecting trading decisions`;

  const buttonLabel = dayCount === 1 ? "Today's" : dayCount === 7 ? "Week's" : "Month's";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-1 bg-white border border-input" 
              style={{ height: '2.6rem', width: '3rem' }}
            >
              <Wand2 className="h-4 w-4" />
              <span className="sr-only">Customize {buttonLabel} Analysis</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Customize {buttonLabel} Analysis</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Customize AI Analysis Prompt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="bg-muted rounded-md p-3 text-sm">
            <p className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2" />
              <span className="font-medium">Available Variables:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{totalTrades}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{winRate}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{totalPnL}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{avgTradePnL}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{profitFactor}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{strategyPerformance}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{marketConditionPerformance}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{emotionAnalysis}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{timeAnalysis}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{positionSizing}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{riskMetrics}}'}</code>
              <code className="bg-muted-foreground/20 px-1 rounded text-xs">{'{{tradesData}}'}</code>
            </div>
          </div>
          
          <PromptVariableValues trades={trades} />
          
          <Textarea 
            placeholder="Enter your custom prompt here..." 
            className="min-h-[200px]"
            value={customPrompt || defaultPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCustomPrompt(defaultPrompt)}
            className="text-xs"
          >
            Reset to Default
          </Button>
        </div>

        <Separator />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAnalyze}>
            Run Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
