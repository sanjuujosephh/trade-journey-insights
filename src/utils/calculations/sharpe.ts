
import { Trade } from "@/types/trade";

export const calculateSharpeRatio = (returns: number[]) => {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  // Using daily Sharpe ratio for intraday trading
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);
};
