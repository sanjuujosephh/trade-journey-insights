
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trade } from '@/types/trade';
import { useToast } from './use-toast';
import { format, subDays } from 'date-fns';

export function useTradeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const { toast } = useToast();

  const analyzeTradesForPeriod = async (
    trades: Trade[],
    days: number,
    customPrompt?: string,
    userId?: string
  ): Promise<boolean> => {
    if (trades.length === 0) {
      toast({
        title: "No trades to analyze",
        description: "Please add some trades first.",
        variant: "destructive",
      });
      setCurrentAnalysis('');
      return false;
    }

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to analyze trades.",
        variant: "destructive",
      });
      setCurrentAnalysis('');
      return false;
    }

    setIsAnalyzing(true);
    setCurrentAnalysis('');

    try {
      // Filter trades for the specified period
      const today = new Date();
      const startDate = subDays(today, days);
      
      const filteredTrades = trades.filter(trade => {
        if (!trade.entry_date) return false;
        // Convert DD-MM-YYYY to a Date object
        const [day, month, year] = trade.entry_date.split('-').map(Number);
        const tradeDate = new Date(year, month - 1, day);
        return tradeDate >= startDate && tradeDate <= today;
      });

      if (filteredTrades.length === 0) {
        toast({
          title: "No trades in selected period",
          description: `No trades found in the last ${days} days.`,
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return false;
      }

      console.log(`Analyzing ${filteredTrades.length} trades for the last ${days} days`);
      console.log(`User ID for credit deduction: ${userId}`);

      // Calculate credit cost
      const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
      console.log(`Credit cost for this analysis: ${creditCost}`);

      // Call the Supabase Edge Function with userId for credit deduction
      const { data, error } = await supabase.functions.invoke('analyze-trades', {
        body: {
          trades: filteredTrades,
          days,
          customPrompt,
          userId
        }
      });

      // Check for network/invocation errors
      if (error) {
        console.error('Supabase function error:', error);
        
        // Special handling for 403 errors (credit/auth related)
        if (error.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
          throw new Error('Access denied. You may not have enough credits, or there might be an authentication issue. Please try refreshing the page and logging in again.');
        }
        
        throw new Error(error.message || 'Failed to analyze trades');
      }

      // Check if there was a credit-related issue or other error
      if (data && !data.success) {
        console.error('Analysis failed:', data.error || data.message || 'Unknown error');
        throw new Error(data.message || data.error || "Failed to analyze trades");
      }

      // Log credit usage
      if (data && data.creditsUsed) {
        console.log(`Used ${data.creditsUsed} credits. Remaining: ${data.remainingCredits}`);
      }

      // Set the analysis text
      const analysisText = data?.analysis || '';
      console.log('Analysis result length:', analysisText.length);
      
      setCurrentAnalysis(analysisText);
      
      // Consider analysis successful if it has meaningful content (more than just whitespace)
      const isSuccessful = analysisText.trim().length > 50;
      
      if (isSuccessful) {
        toast({
          title: "Analysis complete",
          description: `Successfully analyzed ${filteredTrades.length} trades. Used ${creditCost} credits.`,
        });
        console.log('Analysis successful');
      } else {
        toast({
          title: "Analysis returned insufficient result",
          description: "The AI couldn't generate a meaningful analysis.",
          variant: "destructive",
        });
        console.log('Analysis failed - insufficient content');
      }

      return isSuccessful;

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze trades",
        variant: "destructive",
      });
      setCurrentAnalysis('');
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    currentAnalysis,
    analyzeTradesForPeriod,
    setCurrentAnalysis
  };
}
