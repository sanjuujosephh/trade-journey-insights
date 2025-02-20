
interface StrategyStats {
  wins: number;
  losses: number;
  totalPnL: number;
}

interface StrategyAnalysisProps {
  strategies: Record<string, StrategyStats>;
}

export function StrategyAnalysis({ strategies }: StrategyAnalysisProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Strategy Performance Review</h3>
      <div className="space-y-4">
        {Object.entries(strategies).map(([strategy, data]) => {
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
    </div>
  );
}
