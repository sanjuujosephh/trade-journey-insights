
import { Trade } from "@/types/trade";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface TimeBasedEmotionAnalysisProps {
  trades: Trade[];
}

export function TimeBasedEmotionAnalysis({ trades }: TimeBasedEmotionAnalysisProps) {
  // Map emotions to numerical values for the chart
  const emotionMap: Record<string, number> = {
    'confident': 10,
    'neutral': 7,
    'calm': 8,
    'excited': 9,
    'anxious': 4,
    'fear': 3,
    'greed': 5,
    'fomo': 2,
    'revenge': 1,
    'impatient': 3,
    'uncertain': 5
  };
  
  // Function to convert time string to hour number
  const timeToHour = (timeStr: string | null | undefined): number => {
    if (!timeStr) return -1;
    
    try {
      const timeParts = timeStr.split(':');
      if (timeParts.length < 2) return -1;
      
      return parseInt(timeParts[0], 10);
    } catch (e) {
      return -1;
    }
  };
  
  // Process trades for the scatter plot
  const emotionData = trades
    .filter(trade => trade.entry_emotion && trade.entry_time)
    .map(trade => {
      const hour = timeToHour(trade.entry_time);
      if (hour === -1) return null;
      
      const emotionValue = trade.entry_emotion ? 
        (emotionMap[trade.entry_emotion.toLowerCase()] || 5) : 5;
      
      return {
        hour,
        emotion: trade.entry_emotion,
        emotionValue,
        outcome: trade.outcome,
        size: 80,
        direction: trade.trade_direction
      };
    })
    .filter(Boolean);
  
  // Process data for emotion by hour
  const hourEmotions: Record<number, { positive: number; negative: number; total: number }> = {};
  
  emotionData.forEach(data => {
    if (!data) return;
    
    if (!hourEmotions[data.hour]) {
      hourEmotions[data.hour] = { positive: 0, negative: 0, total: 0 };
    }
    
    hourEmotions[data.hour].total += 1;
    
    if (data.emotionValue >= 7) {
      hourEmotions[data.hour].positive += 1;
    } else {
      hourEmotions[data.hour].negative += 1;
    }
  });
  
  const hourlyEmotionData = Object.entries(hourEmotions).map(([hour, stats]) => ({
    hour: parseInt(hour, 10),
    positive: stats.positive,
    negative: stats.negative,
    percentPositive: stats.total > 0 ? (stats.positive / stats.total) * 100 : 0
  })).sort((a, b) => a.hour - b.hour);
  
  // Monochrome colors
  const COLORS = {
    profitPositive: "#333333", // dark gray for positive emotion & profit
    profitNegative: "#555555", // medium gray for negative emotion & profit
    lossPositive: "#777777",   // medium-light gray for positive emotion & loss
    lossNegative: "#999999",   // light gray for negative emotion & loss
    gridLines: "#e0e0e0"       // very light gray for grid lines
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Time-Based Emotional Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Explore how your emotions change throughout the trading day and their impact on your trading performance.
      </p>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Emotions Throughout the Day</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                <XAxis 
                  dataKey="hour" 
                  type="number" 
                  domain={[9, 15]} 
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
                  ticks={[9, 10, 11, 12, 13, 14, 15]}
                />
                <YAxis 
                  dataKey="emotionValue" 
                  type="number" 
                  domain={[0, 10]} 
                  label={{ value: 'Emotion (Higher = More Positive)', angle: -90, position: 'insideLeft' }}
                  ticks={[0, 2, 4, 6, 8, 10]}
                />
                <ZAxis dataKey="size" range={[25, 100]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === 'emotionValue') {
                      return [props.payload.emotion, 'Emotion'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Hour: ${label}:00`}
                />
                <Legend />
                <Scatter 
                  name="Emotions" 
                  data={emotionData} 
                  fill="#8884d8"
                >
                  {emotionData.map((entry, index) => {
                    // Color based on outcome and emotion
                    let color = COLORS.profitPositive; // Default
                    
                    if (entry?.outcome === 'profit') {
                      color = entry.emotionValue >= 7 ? COLORS.profitPositive : COLORS.profitNegative;
                    } else {
                      color = entry?.emotionValue >= 7 ? COLORS.lossPositive : COLORS.lossNegative;
                    }
                    
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Emotional Positivity by Hour</h4>
          <div className="mt-4">
            <ul className="list-disc list-inside text-sm space-y-1">
              {hourlyEmotionData.length > 0 ? (
                hourlyEmotionData.map(data => (
                  <li key={data.hour} className="flex items-center">
                    <span className="font-medium w-16">{data.hour}:00</span>
                    <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden ml-2">
                      <div 
                        className="h-full bg-gray-600 transition-all"
                        style={{ width: `${data.percentPositive}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm">{data.percentPositive.toFixed(0)}% positive</span>
                  </li>
                ))
              ) : (
                <li>No time-based emotional data available</li>
              )}
            </ul>
          </div>
          
          {hourlyEmotionData.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Key Insights</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {(() => {
                  // Find the most positive hour
                  const mostPositiveHour = [...hourlyEmotionData]
                    .filter(d => d.positive + d.negative >= 3) // At least 3 trades
                    .sort((a, b) => b.percentPositive - a.percentPositive)[0];
                  
                  // Find the most negative hour
                  const mostNegativeHour = [...hourlyEmotionData]
                    .filter(d => d.positive + d.negative >= 3) // At least 3 trades
                    .sort((a, b) => a.percentPositive - b.percentPositive)[0];
                  
                  return (
                    <>
                      {mostPositiveHour && (
                        <li>You're most emotionally positive at {mostPositiveHour.hour}:00 ({mostPositiveHour.percentPositive.toFixed(0)}% positive emotions)</li>
                      )}
                      {mostNegativeHour && (
                        <li>You're most emotionally negative at {mostNegativeHour.hour}:00 ({(100 - mostNegativeHour.percentPositive).toFixed(0)}% negative emotions)</li>
                      )}
                      <li>Consider how your emotional state changes throughout the day and its impact on your trading decisions</li>
                    </>
                  );
                })()}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
