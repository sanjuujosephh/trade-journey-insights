
import { useState } from "react";
import { Trade } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { calculateTradeStatistics } from "@/utils/calculations/tradeAnalytics";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptVariableValuesProps {
  trades: Trade[];
}

export function PromptVariableValues({ trades }: PromptVariableValuesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (trades.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No trades available to preview variable values
      </div>
    );
  }

  // Calculate the actual statistics that would be used
  const stats = calculateTradeStatistics(trades);
  
  // Format sample data for display
  const strategyPerformanceSample = Object.entries(stats.strategyPerformance)
    .slice(0, 2)
    .map(([strategy, stratStats]) => 
      `${strategy}: ${stratStats.wins} wins, ${stratStats.losses} losses, P&L: ${stratStats.totalPnL.toFixed(2)}`
    ).join('\n');
  
  const marketConditionSample = Object.entries(stats.marketConditionPerformance)
    .slice(0, 2)
    .map(([condition, condStats]) => 
      `${condition}: ${condStats.wins} wins, ${condStats.losses} losses`
    ).join('\n');
  
  // Create variable-value pairs
  const variableValues = [
    { variable: "{{totalTrades}}", value: stats.totalTrades.toString() },
    { variable: "{{winRate}}", value: `${stats.winRate}%` },
    { variable: "{{totalPnL}}", value: stats.totalPnL.toFixed(2) },
    { variable: "{{avgTradePnL}}", value: stats.avgTradePnL.toFixed(2) },
    { variable: "{{profitFactor}}", value: stats.profitFactor.toString() },
    { variable: "{{strategyPerformance}}", value: strategyPerformanceSample + "\n..." },
    { variable: "{{marketConditionPerformance}}", value: marketConditionSample + "\n..." },
    { variable: "{{emotionAnalysis}}", value: "Confident: 3 wins, 1 loss\nFearful: 1 win, 2 losses\n..." },
    { variable: "{{timeAnalysis}}", value: "9:00-10:00: 2 wins, 1 loss, P&L: 230.50\n..." },
    { variable: "{{positionSizing}}", value: "small: 4 trades, Win Rate: 75.0%, P&L: 150.25\n..." },
    { variable: "{{riskMetrics}}", value: `Stop loss usage: ${stats.riskMetrics.stopLossUsage.toFixed(1)}%\nTake profit usage: ${stats.riskMetrics.targetUsage.toFixed(1)}%\n...` },
    { variable: "{{tradesData}}", value: JSON.stringify(trades.slice(0, 1)).substring(0, 50) + "..." },
  ];

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full flex justify-between items-center"
      >
        <span>Preview variable values</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <Card className="p-3">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {variableValues.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 text-xs border-b pb-1 last:border-0">
                  <div className="font-mono bg-muted p-1 rounded">{item.variable}</div>
                  <div className="font-mono whitespace-pre-wrap overflow-x-auto">{item.value}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
