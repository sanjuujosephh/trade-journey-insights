
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

export function AIAnalysisTab() {
  const { userId } = useTradeAuth();
  const { trades } = useTradeQueries(userId);
  const {
    credits,
    transactions,
    isLoading: isLoadingCredits,
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
      
      // The credit deduction is now handled by the edge function
      // We just need to pass the userId to the analyzeTradesForPeriod function
      const analysisSuccess = await analyzeTradesForPeriod(trades, days, customPrompt, userId);
      
      // Refetch credits to update UI after analysis
      await refetch();
      
      if (!analysisSuccess) {
        console.log('Analysis failed');
        
        // Credits are not deducted if analysis fails, due to edge function handling
        toast.error('Analysis failed. Please try again later.');
      } else {
        // Analysis was successful, credits already deducted by edge function
        toast.success(`Analysis complete! Used ${creditCost} credits.`);
      }
      
      // Final refetch to ensure UI is up-to-date
      await refetch();
      
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
      />
    </div>;
}
