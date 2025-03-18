
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmotionalImpactAnalysis } from "./behavioral/EmotionalImpactAnalysis";
import { TradeDecisionQuality } from "./behavioral/TradeDecisionQuality";
import { StressPerformanceCorrelation } from "./behavioral/StressPerformanceCorrelation";
import { DevotionScoreAnalysis } from "./behavioral/DevotionScoreAnalysis";
import { EmotionPerformanceComparison } from "./behavioral/EmotionPerformanceComparison";
import { ImpulsiveVsPlannedTrades } from "./behavioral/ImpulsiveVsPlannedTrades";
import { TimeBasedEmotionAnalysis } from "./behavioral/TimeBasedEmotionAnalysis";
import { BehavioralTrends } from "./behavioral/BehavioralTrends";

interface BehavioralAnalyticsTabProps {
  trades: Trade[];
}

export function BehavioralAnalyticsTab({ trades }: BehavioralAnalyticsTabProps) {
  const [activeTab, setActiveTab] = useState("emotions");

  return (
    <div className="space-y-6">
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap border-b rounded-none px-4">
            <TabsTrigger value="emotions">Emotional Impact</TabsTrigger>
            <TabsTrigger value="decision">Decision Quality</TabsTrigger>
            <TabsTrigger value="stress">Stress & Performance</TabsTrigger>
            <TabsTrigger value="devotion">Discipline Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Emotion Comparison</TabsTrigger>
            <TabsTrigger value="impulsive">Impulsive Trading</TabsTrigger>
            <TabsTrigger value="time">Time & Emotions</TabsTrigger>
            <TabsTrigger value="trends">Behavioral Trends</TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            <TabsContent value="emotions" className="mt-0">
              <EmotionalImpactAnalysis trades={trades} />
            </TabsContent>
            
            <TabsContent value="decision" className="mt-0">
              <TradeDecisionQuality trades={trades} />
            </TabsContent>
            
            <TabsContent value="stress" className="mt-0">
              <StressPerformanceCorrelation trades={trades} />
            </TabsContent>
            
            <TabsContent value="devotion" className="mt-0">
              <DevotionScoreAnalysis trades={trades} />
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-0">
              <EmotionPerformanceComparison trades={trades} />
            </TabsContent>
            
            <TabsContent value="impulsive" className="mt-0">
              <ImpulsiveVsPlannedTrades trades={trades} />
            </TabsContent>
            
            <TabsContent value="time" className="mt-0">
              <TimeBasedEmotionAnalysis trades={trades} />
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <BehavioralTrends trades={trades} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
