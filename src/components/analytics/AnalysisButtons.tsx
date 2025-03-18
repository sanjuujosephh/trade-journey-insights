
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trade } from '@/types/trade';
import { CustomPromptAccordion } from './CustomPromptAccordion';
import { CustomPromptDialog } from './CustomPromptDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, TrendingUp, Brain, Lightbulb } from 'lucide-react';

interface AnalysisButtonsProps {
  trades: Trade[];
  isAnalyzing: boolean;
  onAnalyze: (days: number, customPrompt?: string) => void;
}

export function AnalysisButtons({
  trades,
  isAnalyzing,
  onAnalyze
}: AnalysisButtonsProps) {
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustomPromptDialogOpen, setIsCustomPromptDialogOpen] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<number | null>(null);

  const handleAnalyze = (days: number) => {
    setSelectedAnalysisType(days);
    
    if (customPrompt) {
      onAnalyze(days, customPrompt);
    } else {
      onAnalyze(days);
    }
  };

  const handlePromptSubmit = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleOpenCustomPromptDialog = () => {
    setIsCustomPromptDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trade Analysis</CardTitle>
          <CardDescription>
            Generate AI insights from your trading data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomPromptAccordion onPromptSubmit={handlePromptSubmit} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={selectedAnalysisType === 1 ? "default" : "outline"}
                disabled={isAnalyzing || trades.length === 0}
                onClick={() => handleAnalyze(1)}
                className="flex flex-col items-center justify-center h-20 space-y-1"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Daily Analysis</span>
                <span className="text-xs text-muted-foreground">(1 Credit)</span>
              </Button>
              
              <Button
                variant={selectedAnalysisType === 7 ? "default" : "outline"}
                disabled={isAnalyzing || trades.length === 0}
                onClick={() => handleAnalyze(7)}
                className="flex flex-col items-center justify-center h-20 space-y-1"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Analysis</span>
                <span className="text-xs text-muted-foreground">(3 Credits)</span>
              </Button>
              
              <Button
                variant={selectedAnalysisType === 30 ? "default" : "outline"} 
                disabled={isAnalyzing || trades.length === 0}
                onClick={() => handleAnalyze(30)}
                className="flex flex-col items-center justify-center h-20 space-y-1"
              >
                <Brain className="h-5 w-5" />
                <span>Monthly Analysis</span>
                <span className="text-xs text-muted-foreground">(5 Credits)</span>
              </Button>
            </div>
            
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={handleOpenCustomPromptDialog}
              disabled={isAnalyzing}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Advanced Analysis Options
            </Button>
          </div>
        </CardContent>
      </Card>
            
      <CustomPromptDialog
        open={isCustomPromptDialogOpen}
        onOpenChange={setIsCustomPromptDialogOpen}
        onPromptSubmit={(prompt, type) => {
          setCustomPrompt(prompt);
          if (type) {
            handleAnalyze(type);
          }
        }}
      />
    </>
  );
}
