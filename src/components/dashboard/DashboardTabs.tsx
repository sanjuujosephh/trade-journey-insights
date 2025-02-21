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
import LearningCenter from "@/components/LearningCenter";
import { ProfileSettings } from "@/components/ProfileSettings";
import { PerformanceMetrics } from "@/components/analytics/PerformanceMetrics";
import { Trade } from "@/types/trade";
import { cn } from "@/lib/utils";

interface DashboardTabsProps {
  trades: Trade[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAnalyzing: boolean;
  currentAnalysis: string;
  analyzeTradesWithAI: (options: { days?: number }) => void;
}

const tabColors = {
  "trade-entry": "bg-[#D3E4FD]", // Soft Blue
  "performance": "bg-[#E5DEFF]", // Soft Purple
  "calendar": "bg-[#FFDEE2]", // Soft Pink
  "analysis": "bg-[#F2FCE2]", // Soft Green
  "ai-analysis": "bg-[#FEF7CD]", // Soft Yellow
  "learning": "bg-[#FEC6A1]", // Soft Orange
  "history": "bg-[#FDE1D3]", // Soft Peach
  "profile": "bg-[#F1F0FB]", // Soft Gray
};

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
          {Object.entries({
            "trade-entry": "Trade Entry",
            "performance": "Trade Performance",
            "calendar": "Calendar View",
            "analysis": "Trade Analysis",
            "ai-analysis": "AI Analysis",
            "learning": "Learning Center",
            "history": "Trade History",
            "profile": "Profile"
          }).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "transition-colors duration-200",
                activeTab === value && tabColors[value as keyof typeof tabColors]
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          <TabsContent value="trade-entry" className="mt-0 h-full">
            <TradeEntry />
          </TabsContent>

          <TabsContent value="performance" className="mt-0 h-full">
            <div className="p-6 space-y-6">
              <PerformanceMetrics trades={trades} />
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
              <FOTradeTable trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-0 h-full">
            <LearningCenter />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 h-full">
            <div className="p-6">
              <ProfileSettings />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
