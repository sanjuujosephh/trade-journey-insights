
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type LeaderboardEntry = {
  username: string;
  win_rate: number;
  profit_loss: number;
  avatar_url: string | null;
};

type TradeWithProfile = {
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  exit_price: number | null;
  entry_price: number;
  quantity: number;
  outcome: string;
};

type UserStats = {
  username: string;
  avatar_url: string | null;
  total_trades: number;
  winning_trades: number;
  profit_loss: number;
};

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data: trades, error } = await supabase
        .from("trades")
        .select(`
          user_id,
          profiles (username, avatar_url),
          exit_price,
          entry_price,
          quantity,
          outcome
        `)
        .throwOnError();

      if (!trades) return [];

      // Group trades by user and calculate statistics
      const userStats = trades.reduce<Record<string, UserStats>>((acc, trade) => {
        const userId = trade.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            username: trade.profiles?.username || "Anonymous",
            avatar_url: trade.profiles?.avatar_url,
            total_trades: 0,
            winning_trades: 0,
            profit_loss: 0,
          };
        }
        
        acc[userId].total_trades++;
        if (trade.outcome === 'profit') {
          acc[userId].winning_trades++;
        }
        
        if (trade.exit_price && trade.entry_price && trade.quantity) {
          acc[userId].profit_loss += (trade.exit_price - trade.entry_price) * trade.quantity;
        }
        
        return acc;
      }, {});

      const leaderboardEntries: LeaderboardEntry[] = Object.values(userStats).map((stats) => ({
        username: stats.username,
        win_rate: (stats.winning_trades / stats.total_trades) * 100 || 0,
        profit_loss: stats.profit_loss,
        avatar_url: stats.avatar_url,
      }));

      return leaderboardEntries
        .sort((a, b) => b.profit_loss - a.profit_loss)
        .slice(0, 10); // Show only top 10 performers
    },
  });

  if (isLoading) {
    return <div>Loading leaderboard...</div>;
  }

  if (!leaderboard?.length) {
    return <div className="text-center text-muted-foreground">No trades recorded yet</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trader</TableHead>
          <TableHead className="text-right">Win Rate</TableHead>
          <TableHead className="text-right">P/L</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((entry) => (
          <TableRow key={entry.username}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={entry.avatar_url || undefined} />
                <AvatarFallback>{entry.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              {entry.username}
            </TableCell>
            <TableCell className="text-right">
              {entry.win_rate.toFixed(1)}%
            </TableCell>
            <TableCell className="text-right">
              ${entry.profit_loss.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
