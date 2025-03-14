
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
    customPrompt?: string
  ) => {
    if (trades.length === 0) {
      toast({
        title: "No trades to analyze",
        description: "Please add some trades first.",
        variant: "destructive",
      });
      return;
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
        return;
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-trades', {
        body: {
          trades: filteredTrades,
          days,
          customPrompt
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setCurrentAnalysis(data.analysis || 'No analysis could be generated.');
      
      toast({
        title: "Analysis complete",
        description: `Successfully analyzed ${filteredTrades.length} trades.`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze trades",
        variant: "destructive",
      });
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
