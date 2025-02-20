
import { TrendingUp, TrendingDown, Brain } from "lucide-react";

interface TradeAnalysis {
  id: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  outcome: 'profit' | 'loss' | 'breakeven';
  lesson: string;
}

interface RecentTradesAnalysisProps {
  trades: TradeAnalysis[];
}

export function RecentTradesAnalysis({ trades }: RecentTradesAnalysisProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Recent Trades Analysis</h3>
      <div className="space-y-4">
        {trades.map((trade) => (
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
    </div>
  );
}
