
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { TimePerformanceHeatmap } from "./TimePerformanceHeatmap";
import { StrategyPerformance } from "./StrategyPerformance";
import { MarketConditionAnalysis } from "./MarketConditionAnalysis";
import { TechnicalIndicatorImpact } from "./TechnicalIndicatorImpact";
import { VolatilityImpactAnalysis } from "./VolatilityImpactAnalysis";
import { StreakChart } from "./StreakChart";
import { VixTradeCorrelation } from "./VixTradeCorrelation";
import { TradeDirectionPerformance } from "./TradeDirectionPerformance";
import { TradeFlowChart } from "./TradeFlowChart";

interface PerformanceAnalyticsTabProps {
  trades: Trade[];
}

export function PerformanceAnalyticsTab({ trades }: PerformanceAnalyticsTabProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PerformanceMetrics trades={trades} />
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap border-b rounded-none px-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeframe">Time Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Strategy Analysis</TabsTrigger>
            <TabsTrigger value="market">Market Conditions</TabsTrigger>
            <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
            <TabsTrigger value="volatility">Volatility Impact</TabsTrigger>
            <TabsTrigger value="direction">Direction Analysis</TabsTrigger>
            <TabsTrigger value="flow">Trade Flow</TabsTrigger>
            <TabsTrigger value="streaks">Win/Loss Streaks</TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="overview" className="mt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Overview of your trading performance across different metrics. Use the tabs to explore specific aspects of your trading.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TimePerformanceHeatmap trades={trades} />
                <StrategyPerformance trades={trades} />
              </div>
            </TabsContent>
            
            <TabsContent value="timeframe" className="mt-0">
              <TimePerformanceHeatmap trades={trades} />
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-0">
              <StrategyPerformance trades={trades} />
            </TabsContent>
            
            <TabsContent value="market" className="mt-0">
              <MarketConditionAnalysis trades={trades} />
            </TabsContent>
            
            <TabsContent value="indicators" className="mt-0">
              <TechnicalIndicatorImpact trades={trades} />
            </TabsContent>
            
            <TabsContent value="volatility" className="mt-0">
              <VolatilityImpactAnalysis trades={trades} />
            </TabsContent>
            
            <TabsContent value="direction" className="mt-0">
              <TradeDirectionPerformance trades={trades} />
            </TabsContent>
            
            <TabsContent value="flow" className="mt-0">
              <TradeFlowChart trades={trades} />
            </TabsContent>
            
            <TabsContent value="streaks" className="mt-0">
              <StreakChart trades={trades} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
