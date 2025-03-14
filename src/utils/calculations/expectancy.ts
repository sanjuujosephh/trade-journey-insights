
import { Trade } from "@/types/trade";

export const calculateExpectancy = (trades: Trade[]) => {
  const completedTrades = trades.filter(t => t.exit_price && t.quantity);
  if (completedTrades.length === 0) return 0;

  const winningTrades = completedTrades.filter(t => t.outcome === 'profit');
  const losingTrades = completedTrades.filter(t => t.outcome === 'loss');

  const avgWin = winningTrades.reduce((sum, t) => {
    return sum + ((t.exit_price! - t.entry_price) * t.quantity!);
  }, 0) / (winningTrades.length || 1);

  const avgLoss = losingTrades.reduce((sum, t) => {
    return sum + Math.abs((t.exit_price! - t.entry_price) * t.quantity!);
  }, 0) / (losingTrades.length || 1);

  const winRate = winningTrades.length / completedTrades.length;
  return (winRate * avgWin) - ((1 - winRate) * avgLoss);
};
