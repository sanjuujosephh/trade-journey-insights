
import { Trade } from "@/types/trade";

interface TradeStatistics {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgTradePnL: number;
  profitFactor: number;
  strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }>;
  marketConditionPerformance: Record<string, { wins: number; losses: number }>;
  riskMetrics: {
    stopLossUsage: number;
    targetUsage: number;
  };
}

export function calculateTradeStatistics(trades: Trade[]): TradeStatistics {
  // Calculate basic stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.outcome === 'profit');
  const losingTrades = trades.filter(t => t.outcome === 'loss');

  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  // Calculate P&L metrics
  const calculatePnL = (trade: Trade): number => {
    if (!trade.exit_price || !trade.entry_price || !trade.quantity) return 0;
    return (trade.exit_price - trade.entry_price) * trade.quantity;
  };

  const totalPnL = trades.reduce((sum, trade) => sum + calculatePnL(trade), 0);
  const avgTradePnL = totalTrades > 0 ? totalPnL / totalTrades : 0;
  
  // Calculate profit factor
  const grossProfit = winningTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0) || 0;
  const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + calculatePnL(trade), 0)) || 1; // Avoid division by zero
  const profitFactor = grossProfit / grossLoss;

  // Analyze strategy performance
  const strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }> = {};
  trades.forEach(trade => {
    const strategy = trade.strategy || 'Unspecified';
    if (!strategyPerformance[strategy]) {
      strategyPerformance[strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }
    
    const pnl = calculatePnL(trade);
    if (pnl > 0) strategyPerformance[strategy].wins++;
    else if (pnl < 0) strategyPerformance[strategy].losses++;
    
    strategyPerformance[strategy].totalPnL += pnl;
  });

  // Analyze market condition performance
  const marketConditionPerformance: Record<string, { wins: number; losses: number }> = {};
  trades.forEach(trade => {
    const condition = trade.market_condition || 'Unspecified';
    if (!marketConditionPerformance[condition]) {
      marketConditionPerformance[condition] = { wins: 0, losses: 0 };
    }
    
    const pnl = calculatePnL(trade);
    if (pnl > 0) marketConditionPerformance[condition].wins++;
    else if (pnl < 0) marketConditionPerformance[condition].losses++;
  });

  // Calculate risk metrics
  const stopLossUsage = totalTrades > 0 ? 
    (trades.filter(t => t.exit_reason === 'stop_loss').length / totalTrades) * 100 : 0;
  const targetUsage = totalTrades > 0 ? 
    (trades.filter(t => t.exit_reason === 'target_reached').length / totalTrades) * 100 : 0;

  return {
    totalTrades,
    winRate,
    totalPnL,
    avgTradePnL,
    profitFactor,
    strategyPerformance,
    marketConditionPerformance,
    riskMetrics: {
      stopLossUsage,
      targetUsage
    }
  };
}
