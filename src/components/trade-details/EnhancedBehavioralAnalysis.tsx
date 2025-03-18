
import { Trade } from "@/types/trade";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface EnhancedBehavioralAnalysisProps {
  trade: Trade;
}

export function EnhancedBehavioralAnalysis({ trade }: EnhancedBehavioralAnalysisProps) {
  // Safely determine if plan was followed based on exit reason
  const followedPlan = trade.exit_reason === 'target_reached' || trade.exit_reason === 'stop_loss';
  const isTarget = trade.exit_reason === "target_reached";
  const isImpulsive = trade.is_impulsive || trade.exit_reason === 'manual';

  // Prepare data for the pie chart - Decision quality
  const decisionData = [
    { name: 'Followed Plan', value: followedPlan ? 1 : 0 },
    { name: 'Deviated', value: followedPlan ? 0 : 1 },
  ];

  // Colors for the pie chart
  const COLORS = ['#4caf50', '#f44336'];

  // Prepare data for stress vs. performance chart
  const emotionData = [
    { name: 'Stress', value: trade.stress_level || 5 },
    { name: 'Confidence', value: trade.confidence_level || 5 },
    { name: 'Satisfaction', value: trade.satisfaction_score || 5 },
  ];

  // Determine the psychological balance (positive or negative indicators)
  const emotionalScore = calculateEmotionalScore(trade);
  const psychBalance = emotionalScore > 0 ? 'Positive' : emotionalScore < 0 ? 'Negative' : 'Neutral';

  return (
    <div className="col-span-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Behavioral Analysis</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Followed Plan:</span>
            <p className="font-medium">{followedPlan ? 'Yes' : 'No'}</p>
          </div>
          
          {!followedPlan && trade.exit_reason && (
            <div>
              <span className="text-sm text-muted-foreground">Deviation Type:</span>
              <p className="font-medium">{trade.exit_reason}</p>
            </div>
          )}
          
          <div>
            <span className="text-sm text-muted-foreground">Impulsive Trade:</span>
            <p className="font-medium">{isImpulsive ? 'Yes' : 'No'}</p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Time Pressure:</span>
            <p className="font-medium">{trade.time_pressure || 'Not recorded'}</p>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Psychological Balance:</span>
            <p className="font-medium">{psychBalance}</p>
          </div>
        </div>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={emotionData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value}/10`, '']}
                labelStyle={{ fontSize: 12 }}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="text-sm font-medium mb-2">Entry Emotion:</div>
          <p className="p-2 bg-muted rounded-md">{trade.entry_emotion || 'Not recorded'}</p>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Exit Emotion:</div>
          <p className="p-2 bg-muted rounded-md">{trade.exit_emotion || 'Not recorded'}</p>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate an emotional score based on the trade's emotional data
function calculateEmotionalScore(trade: Trade): number {
  let score = 0;
  
  // Entry emotion scoring
  if (trade.entry_emotion) {
    const entryEmotionScore: Record<string, number> = {
      'confident': 5,
      'neutral': 0,
      'fear': -3,
      'greed': -4,
      'fomo': -5,
      'revenge': -5,
      'anxious': -3,
      'excited': 2,
      'impatient': -2
    };
    
    score += entryEmotionScore[trade.entry_emotion.toLowerCase()] || 0;
  }
  
  // Exit emotion scoring
  if (trade.exit_emotion) {
    const exitEmotionScore: Record<string, number> = {
      'satisfied': 5,
      'relieved': 3,
      'neutral': 0,
      'regretful': -4,
      'frustrated': -3,
      'disappointed': -3,
      'angry': -5,
      'happy': 4
    };
    
    score += exitEmotionScore[trade.exit_emotion.toLowerCase()] || 0;
  }
  
  // Add stress level impact (higher stress = negative impact)
  if (trade.stress_level !== null && trade.stress_level !== undefined) {
    score -= Math.max(0, (trade.stress_level - 5) / 2);
  }
  
  // Add confidence level impact (higher confidence = positive impact)
  if (trade.confidence_level !== null && trade.confidence_level !== undefined) {
    score += (trade.confidence_level - 5) / 2;
  }
  
  // Impulsive trades tend to have worse outcomes
  if (trade.is_impulsive) {
    score -= 2;
  }
  
  // Plan deviation typically has a negative impact
  if (trade.plan_deviation) {
    score -= 3;
  }
  
  return score;
}
