import { Trade } from "@/types/trade";

/**
 * Calculates the total profit from a list of trades.
 * @param trades An array of Trade objects.
 * @returns The total profit as a number.
 */
export function calculateTotalProfit(trades: Trade[]): number {
  return trades.reduce((total, trade) => {
    const profit = (trade.exit_price || 0) - trade.entry_price;
    return total + (profit * (trade.quantity || 1));
  }, 0);
}

/**
 * Calculates the win rate from a list of trades.
 * @param trades An array of Trade objects.
 * @returns The win rate as a percentage.
 */
export function calculateWinRate(trades: Trade[]): number {
  const winningTrades = trades.filter(trade => trade.outcome === "profit");
  const totalTrades = trades.length;
  
  if (totalTrades === 0) {
    return 0;
  }
  
  return (winningTrades.length / totalTrades) * 100;
}

/**
 * Calculates the average profit per trade from a list of trades.
 * @param trades An array of Trade objects.
 * @returns The average profit per trade as a number.
 */
export function calculateAverageProfitPerTrade(trades: Trade[]): number {
  if (trades.length === 0) {
    return 0;
  }
  
  const totalProfit = calculateTotalProfit(trades);
  return totalProfit / trades.length;
}

/**
 * Calculates the number of trades for each outcome (profit, loss, breakeven).
 * @param trades An array of Trade objects.
 * @returns An object containing the count of trades for each outcome.
 */
export function calculateOutcomeCounts(trades: Trade[]): { profit: number; loss: number; breakeven: number } {
  const profitTrades = trades.filter(trade => trade.outcome === "profit").length;
  const lossTrades = trades.filter(trade => trade.outcome === "loss").length;
  const breakevenTrades = trades.filter(trade => trade.outcome === "breakeven").length;
  
  return {
    profit: profitTrades,
    loss: lossTrades,
    breakeven: breakevenTrades
  };
}

/**
 * Calculates the number of trades for each exit reason (stop loss, target reached, manual, time-based).
 * @param trades An array of Trade objects.
 * @returns An object containing the count of trades for each exit reason.
 */
export function calculateExitReasonCounts(trades: Trade[]): { stopLoss: number; targetReached: number; manual: number; timeBased: number } {
  const stopLossTrades = trades.filter(trade => trade.exit_reason === "stop_loss").length;
  const targetReachedTrades = trades.filter(trade => trade.exit_reason === "target_reached");
  const manualTrades = trades.filter(trade => trade.exit_reason === "manual").length;
  const timeBasedTrades = trades.filter(trade => trade.exit_reason === "time_based").length;
  
  return {
    stopLoss: stopLossTrades,
    targetReached: targetReachedTrades.length,
    manual: manualTrades,
    timeBased: timeBasedTrades
  };
}

/**
 * Calculates the average confidence level from a list of trades.
 * @param trades An array of Trade objects.
 * @returns The average confidence level as a number.
 */
export function calculateAverageConfidenceLevel(trades: Trade[]): number {
  const validConfidenceLevels = trades.filter(trade => trade.confidence_level !== null && trade.confidence_level !== undefined);
  
  if (validConfidenceLevels.length === 0) {
    return 0;
  }
  
  const totalConfidenceLevel = validConfidenceLevels.reduce((sum, trade) => sum + (trade.confidence_level || 0), 0);
  return totalConfidenceLevel / validConfidenceLevels.length;
}
