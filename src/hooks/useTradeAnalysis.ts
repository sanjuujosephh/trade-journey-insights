
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

      console.log(`Analyzing ${filteredTrades.length} trades for the last ${days} days...`);

      // Call the analyze-trades edge function
      const { data, error } = await supabase.functions.invoke('analyze-trades', {
        body: {
          trades: filteredTrades,
          days,
          customPrompt,
          userId
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to analyze trades');
      }

      if (!data?.success) {
        console.error('Analysis failed:', data?.error || data?.message);
        throw new Error(data?.message || data?.error || 'Analysis failed');
      }

      // Set the analysis results
      setCurrentAnalysis(data.analysis || '');
      
      return true;
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Failed to analyze trades';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error cases
        if (errorMessage.includes('Insufficient credits')) {
          errorMessage = 'You don\'t have enough credits for this analysis.';
        }
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
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
