
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BehavioralPatterns } from "./learning-center/BehavioralPatterns";
import { StrategyAnalysis } from "./learning-center/StrategyAnalysis";
import { RecentTradesAnalysis } from "./learning-center/RecentTradesAnalysis";
import { TradingRules } from "./learning-center/TradingRules";

interface Trade {
  id: string;
  entry_price: number;
  exit_price?: number | null;
  quantity?: number | null;
  outcome: 'profit' | 'loss' | 'breakeven';
  strategy?: string | null;
  trade_type: string;
  entry_time?: string | null;
  exit_time?: string | null;
  timestamp: string;
  stop_loss?: number | null;
  notes?: string | null;
}

interface StrategyStats {
  wins: number;
  losses: number;
  totalPnL: number;
}

export default function LearningCenter() {
  const { data: trades = [] } = useQuery<Trade[]>({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      return data;
    },
  });

  const behavioralPatterns = [
    {
      pattern: "Revenge Trading",
      detection: trades.filter((t, i, arr) => {
        if (i === 0) return false;
        const prevTrade = arr[i - 1];
        return prevTrade.outcome === "loss" && 
               t.quantity && prevTrade.quantity &&
               t.quantity > prevTrade.quantity * 1.5 &&
               new Date(t.timestamp).getTime() - new Date(prevTrade.timestamp).getTime() < 3600000;
      }).length,
      suggestion: "Take a break after losses to avoid emotional decisions"
    },
    {
      pattern: "FOMO Trading",
      detection: trades.filter(t => {
        const hour = new Date(t.timestamp).getHours();
        return hour === 9 || hour === 15; // First and last hour of trading
      }).length,
      suggestion: "Avoid trading during highly volatile market hours unless part of your strategy"
    },
    {
      pattern: "Early Exit in Profit",
      detection: trades.filter(t => 
        t.exit_price && t.stop_loss && t.exit_price < t.stop_loss && t.outcome === "profit"
      ).length,
      suggestion: "Consider letting profits run with trailing stop loss"
    },
    {
      pattern: "Stop Loss Violation",
      detection: trades.filter(t => 
        t.exit_price && t.stop_loss && t.exit_price < t.stop_loss && t.outcome === "loss"
      ).length,
      suggestion: "Strictly honor your stop loss levels"
    }
  ];

  const strategyAnalysis = trades.reduce<Record<string, StrategyStats>>((acc, trade) => {
    const strategy = trade.strategy || 'Unspecified';
    if (!acc[strategy]) {
      acc[strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }

    if (trade.outcome === 'profit') {
      acc[strategy].wins++;
    } else if (trade.outcome === 'loss') {
      acc[strategy].losses++;
    }

    if (trade.exit_price && trade.quantity) {
      acc[strategy].totalPnL += (trade.exit_price - trade.entry_price) * trade.quantity;
    }

    return acc;
  }, {});

  const emotionalKeywords = {
    negative: ['frustrated', 'angry', 'fear', 'worried', 'revenge', 'fomo', 'regret'],
    positive: ['patient', 'disciplined', 'confident', 'calm', 'focused', 'planned'],
  };

  const analyzeSentiment = (notes: string) => {
    const lowerNotes = notes.toLowerCase();
    const negativeCount = emotionalKeywords.negative.filter(word => lowerNotes.includes(word)).length;
    const positiveCount = emotionalKeywords.positive.filter(word => lowerNotes.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  };

  const recentTradesAnalysis = trades.slice(0, 5).map(trade => ({
    id: trade.id,
    date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
    sentiment: trade.notes ? analyzeSentiment(trade.notes) : 'neutral',
    outcome: trade.outcome,
    lesson: trade.notes || "No notes provided",
  }));

  const calculateConsistencyScore = () => {
    if (trades.length === 0) return 0;
    
    let score = 100;
    
    const tradesWithoutStopLoss = trades.filter(t => !t.stop_loss).length;
    score -= (tradesWithoutStopLoss / trades.length) * 30;
    
    const overtradingDays = new Set(
      trades.filter(t => {
        const dayTrades = trades.filter(trade => 
          new Date(trade.timestamp).toDateString() === new Date(t.timestamp).toDateString()
        );
        return dayTrades.length > 2;
      }).map(t => new Date(t.timestamp).toDateString())
    ).size;
    score -= (overtradingDays / Math.ceil(trades.length / 2)) * 20;
    
    return Math.max(0, Math.min(100, score));
  };

  const consistencyScore = calculateConsistencyScore();

  return (
    <div className="p-6 space-y-6">
      <BehavioralPatterns patterns={behavioralPatterns} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StrategyAnalysis strategies={strategyAnalysis} />
        <RecentTradesAnalysis trades={recentTradesAnalysis} />
      </div>

      <TradingRules consistencyScore={consistencyScore} />
    </div>
  );
}
