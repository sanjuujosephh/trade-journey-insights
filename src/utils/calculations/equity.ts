
import { Trade } from "@/types/trade";

export const calculateEquityCurve = (trades: Trade[]) => {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  // Calculate daily P&L
  let balance = 0;
  return Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades
      .filter(trade => trade.exit_price && trade.quantity)
      .reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0);
    
    balance += dailyPnL;
    return {
      date,
      balance: parseFloat(balance.toFixed(2)),
      dailyPnL: parseFloat(dailyPnL.toFixed(2))
    };
  });
};
