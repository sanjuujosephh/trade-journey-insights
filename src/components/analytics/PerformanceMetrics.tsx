
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Trade } from "@/types/trade";
import { differenceInHours } from "date-fns";

interface MetricCardProps {
  label: string;
  value: string | number;
  tooltipText?: string;
  indicator?: "positive" | "negative";
}

function MetricCard({ label, value, tooltipText, indicator }: MetricCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        {tooltipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className={`text-lg font-semibold ${
        indicator === 'positive' ? 'text-green-600' :
        indicator === 'negative' ? 'text-red-600' :
        ''
      }`}>
        {typeof value === 'number' ? 
          value % 1 === 0 ? value.toString() :
          value.toFixed(2) :
          value}
      </span>
    </Card>
  );
}

interface PerformanceMetricsProps {
  trades: Trade[];
}

export function PerformanceMetrics({ trades }: PerformanceMetricsProps) {
  // Helper function to calculate profit/loss
  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return 0;
    return (trade.exit_price - trade.entry_price) * trade.quantity;
  };

  // Calculate metrics
  const biggestWinner = Math.max(...trades.map(t => calculatePnL(t)).filter(p => p > 0), 0);
  const biggestLoser = Math.min(...trades.map(t => calculatePnL(t)).filter(p => p < 0), 0);

  const winningTrades = trades.filter(t => calculatePnL(t) > 0);
  const losingTrades = trades.filter(t => calculatePnL(t) < 0);

  // AI-assisted metrics (using exit reason and deviation details)
  const tradesFollowedPlan = (trades.filter(t => t.exit_reason === 'target' || t.exit_reason === 'stop_loss').length / trades.length) * 100;
  const winnersWithDeviation = winningTrades.length > 0 ?
    (winningTrades.filter(t => t.exit_reason === 'manual').length / winningTrades.length) * 100 : 0;

  // Calculate average exits
  const avgExitWinner = winningTrades.length > 0 ?
    (winningTrades.reduce((acc, t) => acc + ((t.exit_price! - t.entry_price) / t.entry_price) * 100, 0) / winningTrades.length) : 0;
  const avgExitLoser = losingTrades.length > 0 ?
    (losingTrades.reduce((acc, t) => acc + ((t.exit_price! - t.entry_price) / t.entry_price) * 100, 0) / losingTrades.length) : 0;

  // Calculate holding times
  const winnersHoldingTime = winningTrades.length > 0 ?
    winningTrades.reduce((acc, t) => acc + (t.exit_time && t.entry_time ? 
      differenceInHours(new Date(t.exit_time), new Date(t.entry_time)) : 0), 0) / winningTrades.length : 0;
  const losersHoldingTime = losingTrades.length > 0 ?
    losingTrades.reduce((acc, t) => acc + (t.exit_time && t.entry_time ? 
      differenceInHours(new Date(t.exit_time), new Date(t.entry_time)) : 0), 0) / losingTrades.length : 0;

  // Group trades by day
  const tradesByDay = trades.reduce((acc, trade) => {
    const date = trade.entry_time?.split('T')[0] || '';
    if (!acc[date]) acc[date] = [];
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);

  const tradingDays = Object.keys(tradesByDay).length;
  const tradesPerDay = tradingDays > 0 ? trades.length / tradingDays : 0;

  // Calculate daily P&L metrics
  const dailyPnL = Object.values(tradesByDay).map(dayTrades =>
    dayTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0)
  );

  const avgDayPnL = tradingDays > 0 ?
    dailyPnL.reduce((sum, pnl) => sum + pnl, 0) / tradingDays : 0;

  const winningDays = dailyPnL.filter(pnl => pnl > 0);
  const losingDays = dailyPnL.filter(pnl => pnl < 0);

  const avgWinningDay = winningDays.length > 0 ?
    winningDays.reduce((sum, pnl) => sum + pnl, 0) / winningDays.length : 0;
  const avgLosingDay = losingDays.length > 0 ?
    losingDays.reduce((sum, pnl) => sum + pnl, 0) / losingDays.length : 0;

  // Calculate trade management metrics
  const tradesCorrect = (trades.filter(t => t.exit_reason !== 'manual').length / trades.length) * 100;
  const tradesIncorrect = 100 - tradesCorrect;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      <MetricCard
        label="Biggest Winner"
        value={`₹${biggestWinner.toFixed(2)}`}
        indicator="positive"
      />
      <MetricCard
        label="Biggest Loser"
        value={`₹${biggestLoser.toFixed(2)}`}
        indicator="negative"
      />
      <MetricCard
        label="Plan Adherence"
        value={`${tradesFollowedPlan.toFixed(2)}%`}
        tooltipText="Percentage of trades that followed the planned strategy"
      />
      <MetricCard
        label="Winners with Deviation"
        value={`${winnersWithDeviation.toFixed(2)}%`}
        tooltipText="Percentage of winning trades that deviated from plan"
      />
      <MetricCard
        label="Avg. Exit Winner"
        value={`${avgExitWinner.toFixed(2)}%`}
        indicator="positive"
      />
      <MetricCard
        label="Avg. Exit Loser"
        value={`${avgExitLoser.toFixed(2)}%`}
        indicator="negative"
      />
      <MetricCard
        label="Winners Holding Time"
        value={`${winnersHoldingTime.toFixed(2)}h`}
      />
      <MetricCard
        label="Losers Holding Time"
        value={`${losersHoldingTime.toFixed(2)}h`}
      />
      <MetricCard
        label="Trades per Day"
        value={tradesPerDay.toFixed(2)}
      />
      <MetricCard
        label="Avg Day P&L"
        value={`₹${avgDayPnL.toFixed(2)}`}
        indicator={avgDayPnL > 0 ? "positive" : "negative"}
      />
      <MetricCard
        label="Avg. Winning Day"
        value={`₹${avgWinningDay.toFixed(2)}`}
        indicator="positive"
      />
      <MetricCard
        label="Avg. Losing Day"
        value={`₹${avgLosingDay.toFixed(2)}`}
        indicator="negative"
      />
      <MetricCard
        label="Trades Managed Correctly"
        value={`${tradesCorrect.toFixed(2)}%`}
        tooltipText="Percentage of trades that followed the planned strategy"
      />
      <MetricCard
        label="Trades Managed Incorrectly"
        value={`${tradesIncorrect.toFixed(2)}%`}
        tooltipText="Percentage of trades that deviated from the planned strategy"
      />
    </div>
  );
}
