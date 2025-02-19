
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

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("trades")
        .select(`
          user_id,
          profiles:profiles(username, avatar_url)
        `)
        .gte("timestamp", startOfMonth.toISOString())
        .throwOnError();

      if (!data) return [];

      // Group trades by user and calculate statistics
      const userStats = data.reduce((acc: { [key: string]: any }, trade) => {
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
        return acc;
      }, {});

      // Convert to array and calculate win rates
      return Object.values(userStats)
        .map((stats: any) => ({
          username: stats.username,
          win_rate: (stats.winning_trades / stats.total_trades) * 100 || 0,
          profit_loss: stats.profit_loss,
          avatar_url: stats.avatar_url,
        }))
        .sort((a, b) => b.profit_loss - a.profit_loss)
        .slice(0, 10);
    },
  });

  if (isLoading) {
    return <div>Loading leaderboard...</div>;
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
        {leaderboard?.map((entry) => (
          <TableRow key={entry.username}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={entry.avatar_url || ''} />
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
