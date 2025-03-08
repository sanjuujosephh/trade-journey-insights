
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
      
      console.log("Fetching leaderboard data from get_daily_leaderboard function...");
      
      // Call the database function with explicitly qualified column names
      const { data: leaderboardData, error } = await supabase
        .rpc('get_daily_leaderboard', { limit_count: 10 });
      
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        setIsLoading(false);
        return;
      }
      
      console.log(`Leaderboard data fetched: ${leaderboardData?.length || 0} entries`);
      
      if (!leaderboardData || leaderboardData.length === 0) {
        console.log("No leaderboard data available");
        setIsLoading(false);
        return;
      }
      
      // Separate winners and losers based on profit_loss
      const winners = leaderboardData.filter(entry => entry.profit_loss > 0);
      const losers = leaderboardData.filter(entry => entry.profit_loss < 0);
      
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
