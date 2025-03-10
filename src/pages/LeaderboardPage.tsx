import { useState } from "react";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { formatCurrency } from "@/utils/formatCurrency";
import { TrendingUp, TrendingDown, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
export default function LeaderboardPage() {
  const {
    topTraders,
    topLosers,
    isLoading
  } = useLeaderboardData();
  const [activeTab, setActiveTab] = useState<string>("winners");
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    isSubscribed
  } = useSubscription();
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  if (user && !isSubscribed) {
    navigate("/pricing");
    return null;
  }
  const toggleEntry = (entryId: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  const renderTraderDetails = (entries: any[], isWinners: boolean) => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }
    if (entries.length === 0) {
      return <div className="text-center p-8">
          <p className="text-muted-foreground">No data available yet</p>
        </div>;
    }
    return <div className="space-y-4">
        {entries.map(entry => <Collapsible key={`${entry.username}-${entry.rank}`} open={expandedEntries[`${entry.username}-${entry.rank}`]}>
            <Card>
              <CollapsibleTrigger onClick={() => toggleEntry(`${entry.username}-${entry.rank}`)} className="w-full">
                <CardHeader className={`${isWinners ? 'bg-white dark:bg-green-900/20' : 'bg-white dark:bg-red-900/20'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${isWinners ? 'bg-green-600' : 'bg-red-600'}`}>
                        {entry.rank}
                      </div>
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={entry.avatar_url} alt={entry.username} />
                        <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{entry.username}</div>
                      <div className={`text-sm font-semibold ${isWinners ? 'text-green-600' : 'text-red-600'}`}>
                        {isWinners ? <span className="flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> {formatCurrency(Math.abs(entry.profit_loss))}</span> : <span className="flex items-center"><TrendingDown className="h-3 w-3 mr-1" /> {formatCurrency(Math.abs(entry.profit_loss))}</span>}
                      </div>
                    </div>
                    {entry.chart_link && <a href={entry.chart_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={e => e.stopPropagation()}>
                        <ExternalLink className="h-5 w-5" />
                      </a>}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Info className="h-3 w-3" /> Trading Insights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <div className="text-xs text-muted-foreground">Preferred Timeframe</div>
                          <div className="font-medium">Intraday</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <div className="text-xs text-muted-foreground">Trading Style</div>
                          <div className="font-medium">{isWinners ? 'Trend Following' : 'Counter-Trend'}</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className="font-medium">{isWinners ? '75%' : '35%'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Info className="h-3 w-3" /> {isWinners ? 'Success Factors' : 'Improvement Areas'}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {isWinners ? <>
                            <li>Consistent risk management (2% per trade)</li>
                            <li>Trading with market trend</li>
                            <li>Precise entry and exit strategy</li>
                            <li>Patience and emotional control</li>
                          </> : <>
                            <li>Over-trading during market volatility</li>
                            <li>Poor position sizing</li>
                            <li>Chasing breakouts without confirmation</li>
                            <li>Emotional decision making</li>
                          </>}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>)}
      </div>;
  };
  return <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Trading Leaderboard</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
        <p className="text-muted-foreground">
          Detailed insights from top performers and trading lessons from losses.
          Learn what strategies are working and which mistakes to avoid.
        </p>
      </div>

      <Tabs defaultValue="winners" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="winners" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-green-900/30">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Top Winners</span>
          </TabsTrigger>
          <TabsTrigger value="losers" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-red-900/30">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span>Top Losers</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="winners" className="space-y-4 px-px py-px">
          {renderTraderDetails(topTraders, true)}
        </TabsContent>
        
        <TabsContent value="losers" className="space-y-4">
          {renderTraderDetails(topLosers, false)}
        </TabsContent>
      </Tabs>
    </div>;
}