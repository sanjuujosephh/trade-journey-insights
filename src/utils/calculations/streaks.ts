
import { Trade } from "@/types/trade";

export const calculateStreaks = (trades: Trade[]) => {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  const dailyResults = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades
      .filter(trade => trade.exit_price && trade.quantity)
      .reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0);
    return { date, type: dailyPnL >= 0 ? 'profit' : 'loss' };
  });

  let currentStreak = 0;
  let currentType = '';
  const streaks = [];
  
  for (const result of dailyResults) {
    if (result.type === currentType) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streaks.push({
          type: currentType,
          length: currentStreak
        });
      }
      currentType = result.type;
      currentStreak = 1;
    }
  }
  
  if (currentStreak > 0) {
    streaks.push({
      type: currentType,
      length: currentStreak
    });
  }

  return streaks;
};
