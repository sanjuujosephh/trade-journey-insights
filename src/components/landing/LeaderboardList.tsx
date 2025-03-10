
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { LeaderboardEntry } from "@/hooks/useLeaderboardData";

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  formatAmount: (amount: number) => string;
  isProfit: boolean;
}

export function LeaderboardList({ entries, isLoading, formatAmount, isProfit }: LeaderboardListProps) {
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
        <div className="text-muted-foreground">No data available</div>
        <div className="text-xs text-muted-foreground mt-2">
          (Make sure there are trades with entry and exit prices in the database)
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y h-full">
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
          <div className="flex items-center space-x-3">
            <div className={`flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'} font-semibold`}>
              {isProfit ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {formatAmount(Math.abs(entry.profit_loss))}
            </div>
            {entry.chart_link && (
              <a 
                href={entry.chart_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
