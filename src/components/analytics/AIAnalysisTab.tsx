
import { useEffect, useState } from 'react';
import { AnalysisButtons } from './AnalysisButtons';
import { AnalysisResult } from './AnalysisResult';
import { CustomPromptAccordion } from './CustomPromptAccordion';
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
    analyzeTradesForPeriod,
    setCurrentAnalysis
  } = useTradeAnalysis();
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [showCustomPromptAccordion, setShowCustomPromptAccordion] = useState(false);

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

  // Load saved prompts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPrompts');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved prompts:', error);
      }
    }
  }, []);

  // Save prompts to localStorage
  const saveChatPrompt = (prompt: string) => {
    const updatedPrompts = [...savedPrompts, prompt];
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    toast.success('Prompt saved successfully!');
  };
  
  const removeSavedPrompt = (index: number) => {
    const updatedPrompts = savedPrompts.filter((_, i) => i !== index);
    setSavedPrompts(updatedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
    toast.success('Prompt removed successfully!');
  };
  
  const handlePurchaseClick = () => {
    setIsPurchaseDialogOpen(true);
  };

  const toggleCustomPromptAccordion = () => {
    setShowCustomPromptAccordion(!showCustomPromptAccordion);
  };
  
  return <div className="space-y-6">
      <div className="w-full">
        <CreditsDisplay credits={credits} isLoading={isLoadingCredits} onPurchaseClick={handlePurchaseClick} />
      </div>
      
      <AnalysisButtons 
        isAnalyzing={isAnalyzing} 
        trades={trades} 
        onAnalyze={handleAnalyze} 
        onCustomizeClick={toggleCustomPromptAccordion}
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      {showCustomPromptAccordion && (
        <CustomPromptAccordion 
          customPrompt={customPrompt} 
          setCustomPrompt={setCustomPrompt} 
          isEditingPrompt={isEditingPrompt} 
          setIsEditingPrompt={setIsEditingPrompt} 
          savedPrompts={savedPrompts} 
          onSavePrompt={saveChatPrompt} 
          onRemovePrompt={removeSavedPrompt} 
          onUsePrompt={prompt => {
            setCustomPrompt(prompt);
            setCurrentAnalysis('');
          }} 
          trades={trades}
        />
      )}
      
      <Separator className="my-6" />
      
      {transactions && transactions.length > 0 && (
        <CreditTransactionsPanel transactions={transactions} />
      )}

      <PurchaseCreditsDialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen} />
    </div>;
}
