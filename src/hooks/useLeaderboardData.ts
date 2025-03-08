
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
      
      // Get trades from the last 24 hours - Use a longer time window for testing
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 7); // Using 7 days instead of 1 for testing
      
      console.log("Fetching trades since:", oneDayAgo.toISOString());
      
      // First, get all trades without timestamp filtering
      // This avoids format mismatch issues and we'll filter in memory
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select(`
          id,
          user_id,
          entry_price,
          exit_price,
          quantity,
          timestamp
        `);
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log("All trades fetched:", tradesData?.length || 0);
      
      if (!tradesData || tradesData.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Filter trades by timestamp in memory
      // This is more reliable than using the GT operator with different timestamp formats
      const filteredTrades = tradesData.filter(trade => {
        if (!trade.timestamp) return false;
        const tradeDate = new Date(trade.timestamp);
        return tradeDate >= oneDayAgo;
      });
      
      console.log("Filtered trades within timeframe:", filteredTrades.length, filteredTrades);
      
      if (filteredTrades.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Get unique user IDs from trades
      const userIds = [...new Set(filteredTrades.map(trade => trade.user_id))];
      
      console.log("Unique user IDs:", userIds);
      
      // Fetch profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
        setIsLoading(false);
        return;
      }
      
      console.log("Profiles fetched:", profilesData?.length || 0, profilesData);
      
      // Create a map for quick lookup of profiles by ID
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, {
            username: profile.username || 'Anonymous',
            avatar_url: profile.avatar_url || ''
          });
        });
      }
      
      // Calculate profit/loss for each user
      const userPnLMap = new Map();
      
      filteredTrades.forEach(trade => {
        // Skip trades with missing data
        if (!trade.exit_price || !trade.entry_price || !trade.quantity) {
          console.log("Skipping trade with missing data:", trade);
          return;
        }
        
        const userId = trade.user_id;
        const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
        
        if (!userPnLMap.has(userId)) {
          const profile = profilesMap.get(userId) || { username: 'Anonymous', avatar_url: '' };
          userPnLMap.set(userId, {
            username: profile.username,
            avatar_url: profile.avatar_url,
            profit_loss: 0
          });
        }
        
        const userData = userPnLMap.get(userId);
        userData.profit_loss += pnl;
        userPnLMap.set(userId, userData);
      });
      
      console.log("User PnL calculated:", Array.from(userPnLMap.entries()));
      
      // Convert to array and sort
      const leaderboardEntries = Array.from(userPnLMap.values());
      
      // Separate winners and losers
      const winners = leaderboardEntries
        .filter(entry => entry.profit_loss > 0)
        .sort((a, b) => b.profit_loss - a.profit_loss)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
      const losers = leaderboardEntries
        .filter(entry => entry.profit_loss < 0)
        .sort((a, b) => a.profit_loss - b.profit_loss)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      console.log("Winners:", winners);
      console.log("Losers:", losers);
      
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
