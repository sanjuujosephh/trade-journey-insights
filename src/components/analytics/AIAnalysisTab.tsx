
import { useEffect, useState } from 'react';
import { AnalysisButtons } from './AnalysisButtons';
import { AnalysisResult } from './AnalysisResult';
import { CustomPromptAccordion } from './CustomPromptAccordion';
import { CreditsDisplay } from './CreditsDisplay';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useTradeQueries } from '@/hooks/useTradeQueries';
import { useTradeAuth } from '@/hooks/useTradeAuth';
import { useTradeAnalysis } from '@/hooks/useTradeAnalysis';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';

export function AIAnalysisTab() {
  const { userId } = useTradeAuth();
  const { trades } = useTradeQueries(userId);
  const { userCredits, deductCredits, isLoading: isLoadingCredits } = useUserCredits();
  const { 
    isAnalyzing, 
    currentAnalysis, 
    analyzeTradesForPeriod, 
    setCurrentAnalysis 
  } = useTradeAnalysis();
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);

  const handleAnalyze = async (days: number, customPrompt?: string) => {
    // Credit cost based on days
    const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
    
    if (!userCredits || userCredits < creditCost) {
      toast.error(`You need ${creditCost} credits to analyze ${days} days of trades. You have ${userCredits || 0} credits.`);
      return;
    }
    
    try {
      await analyzeTradesForPeriod(trades, days, customPrompt);
      await deductCredits(creditCost, `Analysis of ${days} days of trades`);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-2">AI Trade Analysis</h2>
        <CreditsDisplay credits={userCredits} />
      </div>
      
      <AnalysisButtons
        isAnalyzing={isAnalyzing}
        trades={trades}
        onAnalyze={handleAnalyze}
      />
      
      <AnalysisResult currentAnalysis={currentAnalysis} />
      
      <Separator />
      
      {currentAnalysis && (
        <CustomPromptAccordion
          savedPrompts={savedPrompts}
          onSavePrompt={saveChatPrompt}
          onRemovePrompt={removeSavedPrompt}
          onUsePrompt={(prompt) => setCurrentAnalysis(prompt)}
        />
      )}
    </div>
  );
}
