
interface TradingRulesProps {
  consistencyScore: number;
}

export function TradingRules({ consistencyScore }: TradingRulesProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Trading Rules & Consistency</h3>
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
      
      <div className="space-y-2">
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
    </div>
  );
}
