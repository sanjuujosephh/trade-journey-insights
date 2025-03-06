
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, PenLine, BarChart2, Calendar, Brain, Bot, GraduationCap, History, Settings, BookText, Store } from "lucide-react";
import TradeEntry from "@/components/TradeEntry";
import { FOTradeTable } from "@/components/analytics/FOTradeTable";
import { TradeFlowChart } from "@/components/analytics/TradeFlowChart";
import { TimePerformanceHeatmap } from "@/components/analytics/TimePerformanceHeatmap";
import { IntradayRiskMetrics } from "@/components/analytics/IntradayRiskMetrics";
import { TradingCalendar } from "@/components/analytics/TradingCalendar";
import LearningCenter from "@/components/LearningCenter";
import { ProfileSettings } from "@/components/ProfileSettings";
import { PerformanceMetrics } from "@/components/analytics/PerformanceMetrics";
import { StrategiesTab } from "@/components/strategies/StrategiesTab";
import { AIAnalysisTab } from "@/components/analytics/AIAnalysisTab";
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
  "trade-entry": "bg-[#D3E4FD]",
  "performance": "bg-[#E5DEFF]",
  "calendar": "bg-[#FFDEE2]",
  "analysis": "bg-[#F2FCE2]",
  "ai-analysis": "bg-[#FEF7CD]",
  "learning": "bg-[#F2FCE2]", // Updated to be consistent with "analysis" tab
  "history": "bg-[#FDE1D3]",
  "shop": "bg-[#E0F2FE]",
  "profile": "bg-[#F1F0FB]",
} as const;

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
    "shop": { label: "Collections", icon: Store },
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
            <div className="p-1 sm:p-2">
              <TradingCalendar />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6 space-y-6">
              <IntradayRiskMetrics trades={trades} />
              <TimePerformanceHeatmap trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="ai-analysis" className="mt-0 h-full">
            <AIAnalysisTab 
              trades={trades}
              isAnalyzing={isAnalyzing}
              currentAnalysis={currentAnalysis}
              analyzeTradesWithAI={analyzeTradesWithAI}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0 h-full">
            <div className="p-1 sm:p-2 md:p-6">
              <FOTradeTable trades={trades} />
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-0 h-full">
            <LearningCenter />
          </TabsContent>

          <TabsContent value="shop" className="mt-0 h-full">
            <StrategiesTab />
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
