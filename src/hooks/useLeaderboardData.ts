
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
      
      console.log("Fetching leaderboard data directly from trades and profiles tables");
      
      // Get all trades with completed profit/loss (having both entry and exit prices)
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .not('exit_price', 'is', null);
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log("All trades fetched:", tradesData?.length || 0);
      console.log("Sample trade data:", tradesData?.[0]);
      
      if (!tradesData || tradesData.length === 0) {
        console.log("No trades found with exit prices");
        setIsLoading(false);
        return;
      }
      
      // Get unique user IDs from trades
      const userIds = [...new Set(tradesData.map(trade => trade.user_id))];
      
      console.log("Unique user IDs:", userIds);
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
        setIsLoading(false);
        return;
      }
      
      console.log("Profiles fetched:", profilesData?.length || 0);
      
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
      
      let validTradesCount = 0;
      let totalPnL = 0;
      
      tradesData.forEach(trade => {
        // Skip trades with missing data
        if (trade.exit_price === null || trade.entry_price === null || trade.quantity === null) {
          console.log(`Skipping trade ${trade.id} due to missing data:`, 
                    `exit_price=${trade.exit_price}, entry_price=${trade.entry_price}, quantity=${trade.quantity}`);
          return;
        }
        
        validTradesCount++;
        const userId = trade.user_id;
        // Ensure we're working with numbers
        const entryPrice = Number(trade.entry_price);
        const exitPrice = Number(trade.exit_price);
        const quantity = Number(trade.quantity);
        
        // Calculate P&L
        const pnl = (exitPrice - entryPrice) * quantity;
        totalPnL += pnl;
        
        console.log(`Trade ${trade.id}: Entry: ${entryPrice}, Exit: ${exitPrice}, Qty: ${quantity}, P&L: ${pnl}`);
        
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
      
      console.log(`Valid trades count: ${validTradesCount}, Total P&L across all trades: ${totalPnL}`);
      
      if (validTradesCount === 0) {
        console.log("No valid trades found with complete entry/exit data");
        setIsLoading(false);
        return;
      }
      
      // Convert to array and sort
      const leaderboardEntries = Array.from(userPnLMap.values());
      console.log("All leaderboard entries before filtering:", leaderboardEntries);
      
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
