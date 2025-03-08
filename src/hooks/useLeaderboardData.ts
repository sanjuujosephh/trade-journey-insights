
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LeaderboardEntry {
  username: string;
  avatar_url: string;
  profit_loss: number;
  rank: number;
}

export function useLeaderboardData() {
  const [topTraders, setTopTraders] = useState<LeaderboardEntry[]>([]);
  const [topLosers, setTopLosers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchLeaderboardData() {
    try {
      setIsLoading(true);
      
      console.log("Fetching leaderboard data from database...");
      
      // Implement direct query approach instead of RPC function to avoid ambiguous column issues
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select(`
          id,
          entry_price,
          exit_price,
          quantity,
          symbol,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .filter('exit_price', 'not.is', null)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Trades data fetched: ${tradesData?.length || 0} entries`);
      
      if (!tradesData || tradesData.length === 0) {
        console.log("No leaderboard data available");
        setIsLoading(false);
        return;
      }
      
      // Process the data to calculate profit/loss per user
      const userProfits = tradesData.reduce((acc, trade) => {
        const profile = trade.profiles;
        if (!profile || !profile.username) return acc;
        
        const userId = profile.id;
        const profitLoss = (trade.exit_price - trade.entry_price) * (trade.quantity || 1);
        
        if (!acc[userId]) {
          acc[userId] = {
            username: profile.username,
            avatar_url: profile.avatar_url || '',
            profit_loss: 0,
            rank: 0
          };
        }
        
        acc[userId].profit_loss += profitLoss;
        return acc;
      }, {} as Record<string, LeaderboardEntry>);
      
      // Convert to array and sort
      const usersArray = Object.values(userProfits);
      
      // Separate winners and losers
      const winners = usersArray
        .filter(entry => entry.profit_loss > 0)
        .sort((a, b) => b.profit_loss - a.profit_loss)
        .map((entry, index) => ({...entry, rank: index + 1}));
      
      const losers = usersArray
        .filter(entry => entry.profit_loss < 0)
        .sort((a, b) => a.profit_loss - b.profit_loss)
        .map((entry, index) => ({...entry, rank: index + 1}));
      
      console.log(`Winners: ${winners.length}, Losers: ${losers.length}`);
      
      setTopTraders(winners);
      setTopLosers(losers);
    } catch (error) {
      console.error('Error in leaderboard fetch:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboardData();

    // Set up a refresher to update every minute
    const intervalId = setInterval(fetchLeaderboardData, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { topTraders, topLosers, isLoading };
}
