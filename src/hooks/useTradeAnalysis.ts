
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trade } from '@/types/trade';
import { useToast } from '@/components/ui/use-toast';
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

      // Call the Supabase Edge Function with userId for credit deduction
      const { data, error } = await supabase.functions.invoke('analyze-trades', {
        body: {
          trades: filteredTrades,
          days,
          customPrompt,
          userId
        }
      });

      // Check for errors
      if (error) {
        console.error('Supabase function error:', error);
        
        if (error.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
          throw new Error('Access denied. You may not have enough credits, or there might be an authentication issue.');
        }
        
        throw new Error(error.message || 'Failed to analyze trades');
      }

      // Check for credit-related issues or other errors
      if (data && !data.success) {
        console.error('Analysis failed:', data.error || data.message || 'Unknown error');
        throw new Error(data.message || data.error || "Failed to analyze trades");
      }

      // Set the analysis text
      const analysisText = data?.analysis || '';
      
      setCurrentAnalysis(analysisText);
      
      // Consider analysis successful if it has meaningful content
      const isSuccessful = analysisText.trim().length > 50;
      
      if (!isSuccessful) {
        toast({
          title: "Analysis returned insufficient result",
          description: "The AI couldn't generate a meaningful analysis.",
          variant: "destructive",
        });
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
