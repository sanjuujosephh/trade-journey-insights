
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
      // Use the secure database function to get leaderboard data
      const { data: leaderboardData, error } = await supabase
        .rpc('get_daily_leaderboard', { limit_count: 10 });

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      if (!leaderboardData) return [];

      // Transform the data to match the expected format
      const leaderboardEntries: LeaderboardEntry[] = leaderboardData
        .filter((entry: any) => entry.profit_loss > 0) // Only show profitable traders for this leaderboard
        .map((entry: any) => ({
          username: entry.username || "Anonymous",
          win_rate: 0, // Win rate calculation not available in this function
          profit_loss: entry.profit_loss,
          avatar_url: entry.avatar_url,
        }));

      return leaderboardEntries;
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
