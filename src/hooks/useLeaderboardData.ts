import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { parseDateString, parseTimeString } from "@/utils/datetime";

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
      
      // Calculate the timestamp for 24 hours ago
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      console.log("Filtering trades since:", twentyFourHoursAgo.toISOString());
      
      // Get all trades 
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select(`
          id,
          user_id,
          entry_date,
          entry_time,
          entry_price,
          exit_price,
          quantity,
          timestamp
        `)
        .not('exit_price', 'is', null);
      
      if (tradesError) {
        console.error('Error fetching trades data:', tradesError);
        setIsLoading(false);
        return;
      }
      
      console.log(`Raw trades data fetched: ${tradesData?.length || 0} trades`);
      
      if (!tradesData || tradesData.length === 0) {
        console.log("No completed trades found");
        setIsLoading(false);
        return;
      }
      
      // Filter trades based on entry date and time being within last 24 hours
      const filtered24HourTrades = tradesData.filter(trade => {
        if (!trade.entry_date || !trade.entry_time) return false;
        
        // Parse entry date and time
        const dateObj = parseDateString(trade.entry_date);
        if (!dateObj) return false;
        
        const { hours, minutes } = parseTimeString(trade.entry_time);
        if (hours === null || minutes === null) return false;
        
        // Set the time on the date object
        dateObj.setHours(hours, minutes, 0, 0);
        
        // Check if the entry datetime is within last 24 hours
        return dateObj >= twentyFourHoursAgo && dateObj <= now;
      });
      
      console.log(`Trades in last 24 hours based on entry date/time: ${filtered24HourTrades.length}`);
      
      // Group trades by user and keep only the latest trade for each user
      const userLatestTradeMap = new Map();
      
      filtered24HourTrades.forEach(trade => {
        const userId = trade.user_id;
        
        if (!userLatestTradeMap.has(userId) || 
            new Date(trade.timestamp) > new Date(userLatestTradeMap.get(userId).timestamp)) {
          userLatestTradeMap.set(userId, trade);
        }
      });
      
      console.log(`Users with trades in last 24 hours: ${userLatestTradeMap.size}`);
      
      // Calculate P&L for each user's latest trade
      const userPnLMap = new Map();
      
      userLatestTradeMap.forEach((trade, userId) => {
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
        
        userPnLMap.set(userId, {
          user_id: userId,
          profit_loss: pnl
        });
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
