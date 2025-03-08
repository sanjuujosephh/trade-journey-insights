
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
      
      console.log("Fetching leaderboard data...");
      
      // First, get all trades with both entry and exit prices (completed trades)
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('user_id, entry_price, exit_price, quantity')
        .not('exit_price', 'is', null);
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Raw trades data fetched: ${tradesData?.length || 0} trades`);
      console.log("Sample trade:", tradesData?.[0]);
      
      if (!tradesData || tradesData.length === 0) {
        console.log("No trades found with exit prices");
        setIsLoading(false);
        return;
      }
      
      // Calculate P&L for each trade and group by user
      const userPnLMap = new Map();
      
      tradesData.forEach(trade => {
        // Ensure we're working with numbers
        const entryPrice = parseFloat(String(trade.entry_price));
        const exitPrice = parseFloat(String(trade.exit_price));
        const quantity = parseFloat(String(trade.quantity));
        
        // Skip trades with invalid data
        if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(quantity)) {
          console.log("Skipping trade with invalid numeric data:", trade);
          return;
        }
        
        // Calculate P&L
        const pnl = (exitPrice - entryPrice) * quantity;
        
        console.log(`Trade P&L calculation: (${exitPrice} - ${entryPrice}) * ${quantity} = ${pnl}`);
        
        // Add to user's total
        if (!userPnLMap.has(trade.user_id)) {
          userPnLMap.set(trade.user_id, {
            user_id: trade.user_id,
            profit_loss: 0
          });
        }
        
        const userData = userPnLMap.get(trade.user_id);
        userData.profit_loss += pnl;
        userPnLMap.set(trade.user_id, userData);
      });
      
      // No valid trades for P&L calculation
      if (userPnLMap.size === 0) {
        console.log("No valid trades found for P&L calculation");
        setIsLoading(false);
        return;
      }
      
      console.log(`User P&L map created with ${userPnLMap.size} users`);
      
      // Get user profiles for the users with trades
      const userIds = Array.from(userPnLMap.keys());
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Fetched ${profilesData?.length || 0} user profiles`);
      
      // Create a map of profiles
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, {
          username: profile.username || 'Anonymous',
          avatar_url: profile.avatar_url || ''
        });
      });
      
      // Combine PnL data with profile data
      const leaderboardEntries: LeaderboardEntry[] = [];
      
      userPnLMap.forEach((data, userId) => {
        const profile = profilesMap.get(userId);
        
        if (profile) {
          leaderboardEntries.push({
            username: profile.username,
            avatar_url: profile.avatar_url,
            profit_loss: data.profit_loss,
            rank: 0 // Will be set later
          });
        } else {
          console.log(`No profile found for user ID: ${userId}`);
        }
      });
      
      console.log(`Created ${leaderboardEntries.length} leaderboard entries`);
      
      // Separate winners and losers
      const winners = leaderboardEntries
        .filter(entry => entry.profit_loss > 0)
        .sort((a, b) => b.profit_loss - a.profit_loss)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
        
      const losers = leaderboardEntries
        .filter(entry => entry.profit_loss < 0)
        .sort((a, b) => a.profit_loss - b.profit_loss)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      console.log(`Winners: ${winners.length}, Losers: ${losers.length}`);
      console.log('Sample winner:', winners[0]);
      console.log('Sample loser:', losers[0]);
      
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
