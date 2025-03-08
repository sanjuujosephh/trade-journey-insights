
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            formatAmount={formatCurrency} 
            isProfit={true}
          />
        </TabsContent>
        
        <TabsContent value="losers" className="m-0">
          <LeaderboardList 
            entries={topLosers} 
            isLoading={isLoading} 
            formatAmount={formatCurrency} 
            isProfit={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
