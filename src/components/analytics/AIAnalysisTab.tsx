
import { useState } from "react";
import { toast } from "sonner";
import { CreditsDisplay } from "./CreditsDisplay";
import { CreditTransactionsPanel } from "./CreditTransactionsPanel";
import { PurchaseCreditsDialog } from "./PurchaseCreditsDialog";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Trade } from "@/types/trade";
import { CustomPromptAccordion } from "./CustomPromptAccordion";
import { AnalysisButtons } from "./AnalysisButtons";
import { AnalysisResult } from "./AnalysisResult";

interface AIAnalysisTabProps {
  trades: Trade[];
  isAnalyzing: boolean;
  currentAnalysis: string;
  analyzeTradesWithAI: (options: { days?: number, customPrompt?: string }) => void;
}

export function AIAnalysisTab({ 
  trades, 
  isAnalyzing, 
  currentAnalysis, 
  analyzeTradesWithAI 
}: AIAnalysisTabProps) {
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>(`As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: {{totalTrades}}
- Win Rate: {{winRate}}%

Strategy Performance:
{{strategyPerformance}}

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement

Trades data: {{tradesData}}`);

  const { 
    credits, 
    transactions, 
    totalCredits,
    isLoading,
    useCredits
  } = useUserCredits();

  const handleAnalyze = async (days: number) => {
    let creditCost = 1; // Default cost
    
    // Adjust cost based on analysis scope
    if (days > 1 && days <= 7) {
      creditCost = 3;
    } else if (days > 7) {
      creditCost = 5;
    }
    
    try {
      // Check if user has enough credits
      if (totalCredits < creditCost) {
        toast.error(`You need ${creditCost} credits for this analysis. Please purchase more credits.`);
        setIsPurchaseDialogOpen(true);
        return;
      }
      
      // Use credits and then perform analysis
      await useCredits.mutateAsync({ 
        amount: creditCost, 
        description: `Trade analysis (${days > 1 ? `${days} days` : 'Today'})`
      });
      
      // Once credits are deducted, run the analysis with custom prompt if editing
      analyzeTradesWithAI({ 
        days,
        customPrompt: isEditingPrompt ? customPrompt : undefined
      });
      
      // Show success message
      toast.success(`Used ${creditCost} ${creditCost === 1 ? 'credit' : 'credits'} for analysis`);
    } catch (error) {
      console.error('Failed to use credits for analysis:', error);
    }
  };

  return (
    <div className="p-1 sm:p-2 md:p-6">
      <CreditsDisplay 
        credits={credits} 
        isLoading={isLoading}
        onPurchaseClick={() => setIsPurchaseDialogOpen(true)}
      />
      
      <CustomPromptAccordion 
        customPrompt={customPrompt}
        setCustomPrompt={setCustomPrompt}
        isEditingPrompt={isEditingPrompt}
        setIsEditingPrompt={setIsEditingPrompt}
      />
      
      <AnalysisButtons 
        isAnalyzing={isAnalyzing} 
        trades={trades} 
        onAnalyze={handleAnalyze} 
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      <CreditTransactionsPanel transactions={transactions} />
      
      <PurchaseCreditsDialog 
        open={isPurchaseDialogOpen} 
        onOpenChange={setIsPurchaseDialogOpen} 
      />
    </div>
  );
}
