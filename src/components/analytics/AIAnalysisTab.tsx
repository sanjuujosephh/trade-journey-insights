
import { useState } from 'react';
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
    useCredits,
    purchaseCredits,
    refetch
  } = useUserCredits();
  const {
    isAnalyzing,
    currentAnalysis,
    analyzeTradesForPeriod
  } = useTradeAnalysis();
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleAnalyze = async (days: number, customPrompt?: string) => {
    try {
      // Credit cost based on days
      const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
      
      if (!credits || credits.subscription_credits + credits.purchased_credits < creditCost) {
        toast.error(`You need ${creditCost} credits to analyze ${days} days of trades. You have ${(credits?.subscription_credits || 0) + (credits?.purchased_credits || 0)} credits.`);
        setIsPurchaseDialogOpen(true);
        return;
      }
      
      // First deduct the credits to ensure they're available
      const creditResult = await useCredits.mutateAsync({
        amount: -creditCost, // Negative amount for deduction
        description: `Analysis of ${days} days of trades`,
        transaction_type: 'deduction'
      });
      
      if (!creditResult.success) {
        toast.error('Failed to use credits: ' + creditResult.message);
        return;
      }
      
      // Immediately refetch credits to update UI
      await refetch();
      
      // Proceed with analysis after credits are successfully deducted
      const analysisSuccess = await analyzeTradesForPeriod(trades, days, customPrompt);
      
      // Refetch credits again to ensure the UI is up-to-date
      await refetch();
      
      // If analysis was not successful, refund the credits
      if (!analysisSuccess) {
        console.log('Analysis failed, refunding credits...');
        
        const refundResult = await useCredits.mutateAsync({
          amount: creditCost, // Positive amount for refund
          description: `Refund for failed analysis of ${days} days of trades`,
          transaction_type: 'refund'
        });
        
        if (refundResult.success) {
          toast.info('Credits have been refunded due to failed analysis.');
        } else {
          toast.error('Failed to refund credits: ' + refundResult.message);
        }
        
        // Refetch credits to update UI after refund
        await refetch();
      } else {
        // Analysis was successful
        toast.success(`Analysis complete! Used ${creditCost} credits.`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze trades. Please try again later.');
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
