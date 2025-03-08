
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
      
      // Updated query approach that works with the existing database structure
      // First get all completed trades from the last 24 hours
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('id, entry_price, exit_price, quantity, symbol, user_id')
        .filter('exit_price', 'not.is', null)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Trades data fetched: ${tradesData?.length || 0} entries`, tradesData);
      
      if (!tradesData || tradesData.length === 0) {
        console.log("No leaderboard data available");
        setIsLoading(false);
        return;
      }
      
      // Now fetch all the profiles in a separate query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url');
        
      if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Profiles data fetched: ${profilesData?.length || 0} entries`, profilesData);
      
      // Create a lookup map for profiles by user_id
      const profilesMap = (profilesData || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, any>);
      
      // Process the data to calculate profit/loss per user
      const userProfits = tradesData.reduce((acc, trade) => {
        const userId = trade.user_id;
        const profile = profilesMap[userId];
        
        // Skip if no matching profile found
        if (!profile || !profile.username) return acc;
        
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
