
import { Trade } from "@/types/trade";

export function calculateTradePnL(trade: Trade): number {
  if (!trade.exit_price || !trade.entry_price || !trade.quantity) {
    return 0;
  }
  
  const directionMultiplier = trade.trade_direction === 'short' ? -1 : 1;
  return directionMultiplier * (trade.exit_price - trade.entry_price) * trade.quantity;
}

export function calculateTotalPnL(trades: Trade[]): number {
  return trades.reduce((sum, trade) => {
    const pnl = calculateTradePnL(trade);
    return sum + pnl;
  }, 0);
}

export function calculateProfit(trade: Trade): number {
  const pnl = calculateTradePnL(trade);
  return pnl > 0 ? pnl : 0;
}

export function calculateLoss(trade: Trade): number {
  const pnl = calculateTradePnL(trade);
  return pnl < 0 ? Math.abs(pnl) : 0;
}

export function calculateProfitPercentage(trade: Trade): number {
  if (!trade.exit_price || !trade.entry_price) {
    return 0;
  }
  
  const directionMultiplier = trade.trade_direction === 'short' ? -1 : 1;
  return directionMultiplier * ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100;
}
