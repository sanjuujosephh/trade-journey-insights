
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { ArrowDown, ArrowUp, TrendingUp, TrendingDown } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  avatar_url: string;
  profit_loss: number;
  rank: number;
}

export function DailyLeaderboard() {
  const [topTraders, setTopTraders] = useState<LeaderboardEntry[]>([]);
  const [topLosers, setTopLosers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        setIsLoading(true);
        
        // Get trades from the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        // First, get the trades
        const { data: tradesData, error: tradesError } = await supabase
          .from('trades')
          .select(`
            id,
            user_id,
            entry_price,
            exit_price,
            quantity
          `)
          .gt('timestamp', oneDayAgo.toISOString())
          .not('exit_price', 'is', null);
        
        if (tradesError) {
          console.error('Error fetching trades data:', tradesError);
          return;
        }
        
        if (!tradesData || tradesData.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Get unique user IDs from trades
        const userIds = [...new Set(tradesData.map(trade => trade.user_id))];
        
        // Fetch profiles separately
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles data:', profilesError);
          return;
        }
        
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
        
        tradesData.forEach(trade => {
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
        
        setTopTraders(winners);
        setTopLosers(losers);
      } catch (error) {
        console.error('Error in leaderboard fetch:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboardData();

    // Set up a refresher to update every minute
    const intervalId = setInterval(fetchLeaderboardData, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  return (
    <div className="w-full bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 bg-muted/30">
        <h2 className="text-2xl font-bold text-center mb-2">Daily Trading Leaderboard</h2>
        <p className="text-muted-foreground text-center">Top performers from the last 24 hours</p>
      </div>
      
      <Tabs defaultValue="winners" className="w-full">
        <div className="px-4 border-b">
          <TabsList className="w-full grid grid-cols-2 mt-2">
            <TabsTrigger value="winners" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Top Traders
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Top Losers
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="winners" className="m-0">
          <LeaderboardList 
            entries={topTraders} 
            isLoading={isLoading} 
            formatAmount={formatAmount} 
            isProfit={true}
          />
        </TabsContent>
        
        <TabsContent value="losers" className="m-0">
          <LeaderboardList 
            entries={topLosers} 
            isLoading={isLoading} 
            formatAmount={formatAmount} 
            isProfit={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  formatAmount: (amount: number) => string;
  isProfit: boolean;
}

function LeaderboardList({ entries, isLoading, formatAmount, isProfit }: LeaderboardListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse text-muted-foreground">Loading leaderboard data...</div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-muted-foreground">No data available for the past 24 hours</div>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {entries.map((entry) => (
        <div key={`${entry.username}-${entry.rank}`} className="flex items-center p-4 hover:bg-muted/30 transition-colors">
          <div className="flex-shrink-0 w-8 text-muted-foreground text-sm font-medium text-center">
            {entry.rank}
          </div>
          <div className="flex items-center gap-3 flex-grow">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={entry.avatar_url} alt={entry.username} />
              <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate">{entry.username}</span>
          </div>
          <div className={`flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'} font-semibold`}>
            {isProfit ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {formatAmount(entry.profit_loss)}
          </div>
        </div>
      ))}
    </div>
  );
}
