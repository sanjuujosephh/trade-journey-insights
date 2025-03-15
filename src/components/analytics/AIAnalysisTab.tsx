
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AnalysisButtons } from './AnalysisButtons';
import { AnalysisResult } from './AnalysisResult';
import { CreditsDisplay } from './CreditsDisplay';
import { PurchaseCreditsDialog } from './PurchaseCreditsDialog';
import { CreditTransactionsPanel } from './CreditTransactionsPanel';
import { useTradeQueries } from '@/hooks/useTradeQueries';
import { useTradeAuth } from '@/hooks/useTradeAuth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useTradeAnalysis } from '@/hooks/useTradeAnalysis';

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
  
  // Force refetch credits when component mounts
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [refetch, userId]);

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
      
      // The credit deduction is handled by the edge function
      const analysisSuccess = await analyzeTradesForPeriod(trades, days, customPrompt, userId);
      
      // Refetch credits to update UI after analysis
      await refetch();
      
      if (!analysisSuccess) {
        toast.error('Analysis failed. Please try again later.');
      } else {
        toast.success(`Analysis complete! Used ${creditCost} credits.`);
      }
      
      // Final refetch to ensure UI is up-to-date
      await refetch();
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze trades. Please try again later.');
      await refetch();
    }
  };
  
  const handlePurchaseClick = () => {
    setIsPurchaseDialogOpen(true);
  };
  
  // Manual refresh credits function
  const forceRefreshCredits = async () => {
    try {
      await refetch();
      toast.success('Credit information refreshed');
    } catch (error) {
      console.error('Error refreshing credits:', error);
      toast.error('Failed to refresh credit information');
    }
  };
  
  return (
    <div className="space-y-6">
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
    </div>
  );
}
