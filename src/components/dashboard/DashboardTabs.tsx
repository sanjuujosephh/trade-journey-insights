
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
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap border-b rounded-none px-2 sm:px-6 bg-background scrollbar-hide">
          {Object.entries(tabConfig).map(([value, { label, icon: Icon }]) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "transition-colors duration-200 flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm",
                activeTab === value && tabColors[value as keyof typeof tabColors]
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="h-[calc(100%-3rem)] overflow-y-auto">
          <TabsContent value="trade-entry" className="mt-0 h-full p-0 sm:p-2">
            <TradeEntry />
          </TabsContent>

          <TabsContent value="performance" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6 space-y-6">
              <PerformanceMetrics trades={trades} />
              <TradeFlowChart trades={trades} />
              <TimePerformanceHeatmap trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 h-full">
            <Card className="p-1 sm:p-2">
              <TradingCalendar />
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6 space-y-6">
              <IntradayRiskMetrics trades={trades} />
              <TimePerformanceHeatmap trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="ai-analysis" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-6">
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 1 })}
                  disabled={isAnalyzing || trades.length === 0}
                  className="w-full md:w-auto"
                >
                  {isAnalyzing ? "Analyzing Today's Trades..." : "Analyze Today's Trades"}
                </Button>
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 7 })}
                  disabled={isAnalyzing || trades.length === 0}
                  className="w-full md:w-auto"
                >
                  Analyze Last 7 Days' Trades
                </Button>
                <Button
                  onClick={() => analyzeTradesWithAI({ days: 30 })}
                  disabled={isAnalyzing || trades.length === 0}
                  className="w-full md:w-auto"
                >
                  Analyze This Month's Trades
                </Button>
              </div>
              <Card className="p-2 sm:p-4 md:p-6">
                {currentAnalysis ? (
                  <p className="whitespace-pre-wrap text-sm md:text-base">{currentAnalysis}</p>
                ) : (
                  <p className="text-muted-foreground text-sm md:text-base">Select an analysis option above to get AI insights about your trades.</p>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6">
              <FOTradeTable trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-0 h-full">
            <LearningCenter />
          </TabsContent>

          <TabsContent value="profile" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6">
              <ProfileSettings />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}

