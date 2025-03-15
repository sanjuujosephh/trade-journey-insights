
import { useState, useEffect } from 'react';
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
import { CustomPromptAccordion } from './CustomPromptAccordion';

export function AIAnalysisTab() {
  const { userId } = useTradeAuth();
  const { trades } = useTradeQueries(userId);
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
  
  // Force refetch credits when component mounts and when userId changes
  useEffect(() => {
    console.log('AIAnalysisTab mounted or userId changed, fetching credits');
    if (userId) {
      refetch();
    }
  }, [refetch, userId]);

  // Log credit information for debugging
  useEffect(() => {
    console.log('Current credits in AIAnalysisTab:', credits);
  }, [credits]);

  const handleAnalyze = async (days: number, customPrompt?: string) => {
    try {
      // Credit cost based on days
      const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
      
      // Ensure we have the latest credit data
      await refetch();
      
      if (!credits || credits.subscription_credits + credits.purchased_credits < creditCost) {
        toast.error(`You need ${creditCost} credits to analyze ${days} days of trades. You have ${(credits?.subscription_credits || 0) + (credits?.purchased_credits || 0)} credits.`);
        setIsPurchaseDialogOpen(true);
        return;
      }
      
      console.log('Starting analysis with credit cost:', creditCost);
      
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
      console.log('Credits deducted, balance updated');
      
      // Proceed with analysis after credits are successfully deducted
      const analysisSuccess = await analyzeTradesForPeriod(trades, days, customPrompt);
      
      // Refetch credits again to ensure the UI is up-to-date
      await refetch();
      
      // If analysis was not successful (empty result), refund the credits
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
        console.log('Credits refunded, balance updated');
      } else {
        // Analysis was successful
        toast.success(`Analysis complete! Used ${creditCost} credits.`);
        // Refetch one more time to be sure UI is updated
        await refetch();
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze trades. Please try again later.');
      // Ensure credits are refetched in case of error
      await refetch();
    }
  };
  
  const handlePurchaseClick = () => {
    setIsPurchaseDialogOpen(true);
  };
  
  // Refresh credits manually
  const forceRefreshCredits = async () => {
    console.log('Manual credit refresh requested');
    try {
      await refetch();
      toast.success('Credit information refreshed');
    } catch (error) {
      console.error('Error refreshing credits:', error);
      toast.error('Failed to refresh credit information');
    }
  };
  
  // Handle various analysis types
  const handleAnalyzePerformance = async () => {
    await handleAnalyze(30, "Analyze my trading performance metrics in detail");
  };
  
  const handleAnalyzeRiskProfile = async () => {
    await handleAnalyze(30, "Evaluate my risk management and provide suggestions");
  };
  
  const handleAnalyzeImprovements = async () => {
    await handleAnalyze(30, "Identify areas of improvement in my trading strategy");
  };
  
  const handleAnalyzePsychology = async () => {
    await handleAnalyze(30, "Analyze my trading psychology and emotional patterns");
  };
  
  const handleCustomAnalysis = async (prompt: string) => {
    await handleAnalyze(30, prompt);
  };
  
  return <div className="space-y-6">
      <div className="w-full">
        <CreditsDisplay 
          credits={credits} 
          isLoading={isLoadingCredits} 
          onPurchaseClick={handlePurchaseClick} 
          onRefresh={forceRefreshCredits}
        />
      </div>
      
      <AnalysisButtons 
        isAnalyzing={isAnalyzing} 
        trades={trades}
        onAnalyze={handleAnalyze}
        onAnalyzePerformance={handleAnalyzePerformance}
        onAnalyzeRiskProfile={handleAnalyzeRiskProfile}
        onAnalyzeImprovements={handleAnalyzeImprovements}
        onAnalyzePsychology={handleAnalyzePsychology}
      />
      
      <CustomPromptAccordion 
        onCustomAnalysis={handleCustomAnalysis}
        isLoading={isAnalyzing}
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      <Separator className="my-6" />
      
      {transactions && transactions.length > 0 && (
        <CreditTransactionsPanel transactions={transactions} />
      )}

      <PurchaseCreditsDialog 
        open={isPurchaseDialogOpen} 
        onOpenChange={(isOpen) => {
          setIsPurchaseDialogOpen(isOpen);
          if (!isOpen) {
            // Refresh credits when the dialog closes
            refetch();
          }
        }} 
        onPurchaseComplete={refetch}
      />
    </div>;
}
