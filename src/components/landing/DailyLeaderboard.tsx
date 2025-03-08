
import { TrendingUp, TrendingDown } from "lucide-react";
import { LeaderboardList } from "./LeaderboardList";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { formatCurrency } from "@/utils/formatCurrency";

export function DailyLeaderboard() {
  const { topTraders, topLosers, isLoading } = useLeaderboardData();

  return (
    <div className="w-full bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 bg-muted/30">
        <h2 className="text-2xl font-bold text-center mb-2">Trading Leaderboard</h2>
        <p className="text-muted-foreground text-center">Top performers from trades in the last 24 hours</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
        {/* Top Traders Column */}
        <div className="flex flex-col">
          <div className="p-4 border-b bg-muted/20 flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <h3 className="font-medium">Top Traders</h3>
          </div>
          <LeaderboardList 
            entries={topTraders} 
            isLoading={isLoading} 
            formatAmount={formatCurrency} 
            isProfit={true}
          />
        </div>
        
        {/* Top Losers Column */}
        <div className="flex flex-col">
          <div className="p-4 border-b bg-muted/20 flex items-center justify-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <h3 className="font-medium">Top Losers</h3>
          </div>
          <LeaderboardList 
            entries={topLosers} 
            isLoading={isLoading} 
            formatAmount={formatCurrency} 
            isProfit={false}
          />
        </div>
      </div>
    </div>
  );
}
