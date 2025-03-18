import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalysisButtons } from "./AnalysisButtons";
import { AnalysisResult } from "./AnalysisResult";
import { CustomPromptAccordion } from "./CustomPromptAccordion";
import { CreditsDisplay } from "./CreditsDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { useTradeAnalysis } from "@/hooks/useTradeAnalysis";
import { PurchaseCreditsDialog } from "./PurchaseCreditsDialog";
import { Loader2 } from "lucide-react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useTradeOperations } from "@/hooks/useTradeOperations";
export function AIAnalysisTab() {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const {
    user
  } = useAuth();
  const {
    isAnalyzing,
    currentAnalysis,
    analyzeTradesForPeriod,
    setCurrentAnalysis
  } = useTradeAnalysis();
  const {
    credits,
    isLoading: isLoadingCredits
  } = useUserCredits();
  const {
    trades
  } = useTradeOperations();

  // Updated function to match the expected signature in DashboardTabs.tsx
  const handleAnalyzeTradesWithAI = (options: {
    days?: number;
    customPrompt?: string;
  }) => {
    if (!user?.id) return;
    const days = options.days || 1;
    const promptText = options.customPrompt || customPrompt;
    if (options.customPrompt) {
      setCustomPrompt(options.customPrompt);
    }

    // Pass the trades to the analysis function
    analyzeTradesForPeriod(trades, days, promptText, user.id);
  };
  return <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        
        
        {isLoadingCredits ? <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading credits...
          </div> : <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <CreditsDisplay credits={credits} isLoading={isLoadingCredits} onPurchaseClick={() => setIsPurchaseDialogOpen(true)} />
            
          </div>}
      </div>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Analysis Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a timeframe to analyze or use custom prompts for specific insights.
            </p>
          </div>
          
          <AnalysisButtons onAnalyze={handleAnalyzeTradesWithAI} isAnalyzing={isAnalyzing} trades={trades} />
          
          <CustomPromptAccordion customPrompt={customPrompt} setCustomPrompt={setCustomPrompt} onSubmit={() => handleAnalyzeTradesWithAI({
          days: 7,
          customPrompt
        })} isAnalyzing={isAnalyzing} />
        </div>
      </Card>
      
      {currentAnalysis && <AnalysisResult currentAnalysis={currentAnalysis} isAnalyzing={isAnalyzing} onClear={() => setCurrentAnalysis('')} />}
      
      <PurchaseCreditsDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen} />
    </div>;
}