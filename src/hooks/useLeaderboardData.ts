import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface LeaderboardEntry {
  username: string;
  avatar_url: string;
  profit_loss: number;
  rank: number;
  chart_link?: string | null;
}

export function useLeaderboardData() {
  const [topTraders, setTopTraders] = useState<LeaderboardEntry[]>([]);
  const [topLosers, setTopLosers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchLeaderboardData() {
    try {
      setIsLoading(true);
      
      console.log("Fetching leaderboard data from database...");
      
      // Use the secure database function to get leaderboard data
      const { data: leaderboardData, error } = await supabase
        .rpc('get_daily_leaderboard', { limit_count: 20 });
      
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        setIsLoading(false);
        return;
      }
      
      console.log(`Leaderboard data fetched: ${leaderboardData?.length || 0} entries`, leaderboardData);
      
      if (!leaderboardData || leaderboardData.length === 0) {
        console.log("No leaderboard data available");
        setTopTraders([]);
        setTopLosers([]);
        setIsLoading(false);
        return;
      }
      
      // Separate winners and losers from the function results
      const winners = leaderboardData
        .filter((entry: any) => entry.profit_loss > 0)
        .map((entry: any) => ({
          username: entry.username,
          avatar_url: entry.avatar_url || '',
          profit_loss: entry.profit_loss,
          rank: entry.rank,
          chart_link: null // Chart links not available in this secure function
        }));
      
      const losers = leaderboardData
        .filter((entry: any) => entry.profit_loss < 0)
        .map((entry: any) => ({
          username: entry.username,
          avatar_url: entry.avatar_url || '',
          profit_loss: entry.profit_loss,
          rank: entry.rank,
          chart_link: null
        }));
      
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
