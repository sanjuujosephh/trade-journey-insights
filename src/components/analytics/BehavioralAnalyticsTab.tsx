
import { Trade } from "@/types/trade";
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
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Behavioral Analysis</h2>
      
      <div className="space-y-12">
        {/* 1. Emotional Impact */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Emotional Impact</h3>
          <EmotionalImpactAnalysis trades={trades} />
        </section>
        
        {/* 2. Decision Quality */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Decision Quality</h3>
          <TradeDecisionQuality trades={trades} />
        </section>
        
        {/* 3. Stress & Performance */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Stress & Performance</h3>
          <StressPerformanceCorrelation trades={trades} />
        </section>
        
        {/* 4. Discipline Analysis */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Discipline Analysis</h3>
          <DevotionScoreAnalysis trades={trades} />
        </section>
        
        {/* 5. Emotion Comparison */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Emotion Comparison</h3>
          <EmotionPerformanceComparison trades={trades} />
        </section>
        
        {/* 6. Impulsive Trading */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Impulsive Trading</h3>
          <ImpulsiveVsPlannedTrades trades={trades} />
        </section>
        
        {/* 7. Time & Emotions */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Time & Emotions</h3>
          <TimeBasedEmotionAnalysis trades={trades} />
        </section>
        
        {/* 8. Behavioral Trends */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Behavioral Trends</h3>
          <BehavioralTrends trades={trades} />
        </section>
      </div>
    </div>
  );
}
