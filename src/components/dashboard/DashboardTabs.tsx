import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine, BarChart2, Calendar, Brain, Bot, GraduationCap, History, Settings } from "lucide-react";
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
  const tabConfig = {
    "trade-entry": { label: "Trade Entry", icon: PenLine },
    "performance": { label: "Trade Analysis", icon: BarChart2 },
    "calendar": { label: "Calendar View", icon: Calendar },
    "analysis": { label: "Behaviour Analysis", icon: Brain },
    "ai-analysis": { label: "AI Analysis", icon: Bot },
    "learning": { label: "Learning Center", icon: GraduationCap },
    "history": { label: "Trade History", icon: History },
    "profile": { label: "Profile", icon: Settings }
  } as const;

  return (
    <Card>
      <Tabs defaultValue="trade-entry" className="h-[calc(100%-4.5rem)]" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none px-6 bg-background">
          {Object.entries(tabConfig).map(([value, { label, icon: Icon }]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "transition-colors duration-200 flex items-center gap-2",
                activeTab === value && tabColors[value as keyof typeof tabColors]
              )}
            >
              <Icon className="w-4 h-4" />
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
