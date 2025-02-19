
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, TrendingUp, Clock, Brain } from "lucide-react";

export default function LearningCenter() {
  const { data: trades = [] } = useQuery({
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

  // Behavioral Analysis
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

  // Strategy Analysis
  const strategyAnalysis = trades.reduce((acc: { 
    [key: string]: { wins: number; losses: number; totalPnL: number } 
  }, trade) => {
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

  // Emotional Analysis from Notes
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

  // Calculate consistency metrics
  const calculateConsistencyScore = () => {
    if (trades.length === 0) return 0;
    
    let score = 100;
    
    // Check stop loss usage
    const tradesWithoutStopLoss = trades.filter(t => !t.stop_loss).length;
    score -= (tradesWithoutStopLoss / trades.length) * 30;
    
    // Check overtrading
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
    <ScrollArea className="h-full p-6">
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trading Psychology Analysis</h3>
          <div className="space-y-4">
            {behavioralPatterns.map((pattern) => (
              <Alert key={pattern.pattern} className={pattern.detection > 0 ? "border-destructive" : ""}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{pattern.pattern}</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="flex justify-between items-center">
                    <span>
                      Detected {pattern.detection} times in your trading history
                    </span>
                    <span className={`text-sm ${
                      pattern.detection > 0 ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {pattern.suggestion}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Strategy Performance Review</h3>
            <div className="space-y-4">
              {Object.entries(strategyAnalysis).map(([strategy, data]) => {
                const totalTrades = data.wins + data.losses;
                const winRate = totalTrades > 0 ? (data.wins / totalTrades) * 100 : 0;
                
                return (
                  <div
                    key={strategy}
                    className="p-4 bg-muted rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{strategy}</span>
                      <span className={`text-sm ${
                        winRate > 50 ? "text-green-600" : "text-red-600"
                      }`}>
                        {winRate.toFixed(1)}% Win Rate
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total P/L: ₹{data.totalPnL.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Trades Analysis</h3>
            <div className="space-y-4">
              {recentTradesAnalysis.map((trade) => (
                <div
                  key={trade.id}
                  className="p-4 bg-muted rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{trade.date}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      trade.sentiment === 'positive'
                        ? "bg-green-100 text-green-800"
                        : trade.sentiment === 'negative'
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {trade.sentiment === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> :
                       trade.sentiment === 'negative' ? <TrendingDown className="w-3 h-3 mr-1" /> :
                       <Brain className="w-3 h-3 mr-1" />}
                      {trade.sentiment}
                    </span>
                  </div>
                  <p className="text-sm">{trade.lesson}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trading Rules & Consistency</h3>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span>Consistency Score</span>
              <span className={`text-lg font-semibold ${
                consistencyScore > 70 ? "text-green-600" :
                consistencyScore > 40 ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {consistencyScore.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-full rounded-full ${
                  consistencyScore > 70 ? "bg-green-600" :
                  consistencyScore > 40 ? "bg-yellow-600" :
                  "bg-red-600"
                }`}
                style={{ width: `${consistencyScore}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              "Never risk more than 1% per trade",
              "Always use stop loss orders",
              "No trading during first 15 minutes",
              "Follow your trading plan",
              "Document every trade with detailed notes",
              "Maximum 2 trades per day",
              "No revenge trading",
              "No averaging down on losses",
            ].map((rule, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-muted rounded-lg"
              >
                <span className="mr-2 font-mono text-sm">{index + 1}.</span>
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
