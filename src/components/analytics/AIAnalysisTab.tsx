
import { useEffect, useState } from 'react';
import { AnalysisButtons } from './AnalysisButtons';
import { AnalysisResult } from './AnalysisResult';
import { CreditsDisplay } from './CreditsDisplay';
import { PurchaseCreditsDialog } from './PurchaseCreditsDialog';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useTradeQueries } from '@/hooks/useTradeQueries';
import { useTradeAuth } from '@/hooks/useTradeAuth';
import { useTradeAnalysis } from '@/hooks/useTradeAnalysis';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import { CreditTransactionsPanel } from './CreditTransactionsPanel';

export function AIAnalysisTab() {
  const {
    userId
  } = useTradeAuth();
  const {
    trades
  } = useTradeQueries(userId);
  const {
    credits,
    transactions,
    isLoading: isLoadingCredits,
    useCredits
  } = useUserCredits();
  const {
    isAnalyzing,
    currentAnalysis,
    analyzeTradesForPeriod
  } = useTradeAnalysis();
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleAnalyze = async (days: number, customPrompt?: string) => {
    // Credit cost based on days
    const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
    
    if (!credits || credits.subscription_credits + credits.purchased_credits < creditCost) {
      toast.error(`You need ${creditCost} credits to analyze ${days} days of trades. You have ${(credits?.subscription_credits || 0) + (credits?.purchased_credits || 0)} credits.`);
      setIsPurchaseDialogOpen(true);
      return;
    }
    
    try {
      await analyzeTradesForPeriod(trades, days, customPrompt);
      
      // Use credits after successful analysis
      await useCredits.mutateAsync({
        amount: creditCost,
        description: `Analysis of ${days} days of trades`
      });
      
      toast.success(`Analysis complete! Used ${creditCost} credits.`);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze trades');
    }
  };
  
  const handlePurchaseClick = () => {
    setIsPurchaseDialogOpen(true);
  };
  
  return <div className="space-y-6">
      <div className="w-full">
        <CreditsDisplay credits={credits} isLoading={isLoadingCredits} onPurchaseClick={handlePurchaseClick} />
      </div>
      
      <AnalysisButtons 
        isAnalyzing={isAnalyzing} 
        trades={trades} 
        onAnalyze={handleAnalyze}
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      <Separator className="my-6" />
      
      {transactions && transactions.length > 0 && (
        <CreditTransactionsPanel transactions={transactions} />
      )}

      <PurchaseCreditsDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen} />
    </div>;
}
