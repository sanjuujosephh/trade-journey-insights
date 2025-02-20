
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TradeEntry from "@/components/TradeEntry";
import { FOTradeTable } from "@/components/analytics/FOTradeTable";
import { TradeFlowChart } from "@/components/analytics/TradeFlowChart";
import { TimePerformanceHeatmap } from "@/components/analytics/TimePerformanceHeatmap";
import { IntradayRiskMetrics } from "@/components/analytics/IntradayRiskMetrics";
import { TradingCalendar } from "@/components/analytics/TradingCalendar";
import { LearningCenter } from "@/components/LearningCenter";
import { ProfileSettings } from "@/components/ProfileSettings";
import { Trade } from "@/types/trade";

interface DashboardTabsProps {
  trades: Trade[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAnalyzing: boolean;
  currentAnalysis: string;
  analyzeTradesWithAI: (options: { days?: number }) => void;
}

export function DashboardTabs({
  trades,
  activeTab,
  setActiveTab,
  isAnalyzing,
  currentAnalysis,
  analyzeTradesWithAI
}: DashboardTabsProps) {
  return (
    <Card>
      <Tabs defaultValue="trade-entry" className="h-[calc(100%-4.5rem)]" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none px-6 bg-background">
          <TabsTrigger value="trade-entry">Trade Entry</TabsTrigger>
          <TabsTrigger value="performance">Trade Performance</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analysis">Trade Analysis</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="learning">Learning Center</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          <TabsContent value="trade-entry" className="mt-0 h-full">
            <TradeEntry />
          </TabsContent>

          <TabsContent value="performance" className="mt-0 h-full">
            <div className="p-6">
              <TradeFlowChart trades={trades} />
              <TimePerformanceHeatmap trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 h-full">
            <Card>
              <TradingCalendar />
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0 h-full">
            <div className="p-6 space-y-6">
              <IntradayRiskMetrics trades={trades} />
              <TimePerformanceHeatmap trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="ai-analysis" className="mt-0 h-full">
            <div className="p-6">
              <div className="flex justify-end space-x-4 mb-6">
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 1 })}
                  disabled={isAnalyzing || trades.length === 0}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Today's Trades...
                    </>
                  ) : (
                    "Analyze Today's Trades"
                  )}
                </Button>
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 7 })}
                  disabled={isAnalyzing || trades.length === 0}
                >
                  Analyze Last 7 Days' Trades
                </Button>
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 30 })}
                  disabled={isAnalyzing || trades.length === 0}
                >
                  Analyze This Month's Trades
                </Button>
              </div>
              <Card className="p-6">
                {currentAnalysis ? (
                  <p className="whitespace-pre-wrap">{currentAnalysis}</p>
                ) : (
                  <p className="text-muted-foreground">Select an analysis option above to get AI insights about your trades.</p>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 h-full">
            <div className="p-6">
              <FOTradeTable 
                trades={trades} 
                onReplayTrade={(trade) => {
                  console.log("Replaying trade:", trade);
                }} 
              />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-0 h-full">
            <LearningCenter />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 h-full p-6">
            <ProfileSettings />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
