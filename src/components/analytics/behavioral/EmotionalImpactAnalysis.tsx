
import { Card } from "@/components/ui/card";
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
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface EmotionalImpactAnalysisProps {
  trades: Trade[];
}

export function EmotionalImpactAnalysis({ trades }: EmotionalImpactAnalysisProps) {
  // Group trades by entry emotion
  const entryEmotionMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number;
    avgPnL: number;
  }>();
  
  // Group trades by exit emotion
  const exitEmotionMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number;
    avgPnL: number;
  }>();
  
  trades.forEach(trade => {
    // Process entry emotion
    const entryEmotion = trade.entry_emotion || "Not Recorded";
    if (!entryEmotionMap.has(entryEmotion)) {
      entryEmotionMap.set(entryEmotion, { 
        wins: 0, 
        losses: 0, 
        totalPnL: 0, 
        count: 0,
        avgPnL: 0
      });
    }
    
    const entryStats = entryEmotionMap.get(entryEmotion)!;
    entryStats.count += 1;
    
    if (trade.outcome === 'profit') {
      entryStats.wins += 1;
    } else if (trade.outcome === 'loss') {
      entryStats.losses += 1;
    }
    
    const pnl = calculateTradePnL(trade);
    entryStats.totalPnL += pnl;
    entryStats.avgPnL = entryStats.totalPnL / entryStats.count;
    
    // Process exit emotion
    const exitEmotion = trade.exit_emotion || "Not Recorded";
    if (!exitEmotionMap.has(exitEmotion)) {
      exitEmotionMap.set(exitEmotion, { 
        wins: 0, 
        losses: 0, 
        totalPnL: 0, 
        count: 0,
        avgPnL: 0
      });
    }
    
    const exitStats = exitEmotionMap.get(exitEmotion)!;
    exitStats.count += 1;
    
    if (trade.outcome === 'profit') {
      exitStats.wins += 1;
    } else if (trade.outcome === 'loss') {
      exitStats.losses += 1;
    }
    
    exitStats.totalPnL += pnl;
    exitStats.avgPnL = exitStats.totalPnL / exitStats.count;
  });
  
  // Prepare entry emotion data for chart
  const entryEmotionData = Array.from(entryEmotionMap.entries())
    .filter(([emotion, stats]) => stats.count > 0)
    .map(([emotion, stats]) => ({
      name: emotion,
      winRate: (stats.wins / stats.count) * 100,
      avgPnL: stats.avgPnL,
      trades: stats.count
    }))
    .sort((a, b) => b.trades - a.trades);
  
  // Prepare exit emotion data for chart
  const exitEmotionData = Array.from(exitEmotionMap.entries())
    .filter(([emotion, stats]) => stats.count > 0)
    .map(([emotion, stats]) => ({
      name: emotion,
      winRate: (stats.wins / stats.count) * 100,
      avgPnL: stats.avgPnL,
      trades: stats.count
    }))
    .sort((a, b) => b.trades - a.trades);
  
  // Colors for emotions
  const EMOTION_COLORS: Record<string, string> = {
    "Confident": "#4CAF50",
    "Fearful": "#F44336",
    "Neutral": "#2196F3",
    "Anxious": "#FF9800",
    "Greedy": "#E91E63",
    "Excited": "#9C27B0",
    "Satisfied": "#4CAF50",
    "Frustrated": "#F44336",
    "Relieved": "#03A9F4",
    "Regretful": "#FF5722",
    "Not Recorded": "#9E9E9E"
  };
  
  // Entry emotion distribution data for pie chart
  const entryDistribution = entryEmotionData.map(item => ({
    name: item.name,
    value: item.trades
  }));
  
  // Find best and worst emotions
  const bestEntryEmotion = entryEmotionData.length > 0 ? 
    entryEmotionData.reduce((prev, current) => (current.winRate > prev.winRate) ? current : prev) : null;
  
  const worstEntryEmotion = entryEmotionData.length > 0 ? 
    entryEmotionData.reduce((prev, current) => (current.winRate < prev.winRate) ? current : prev) : null;
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Emotional Impact Analysis</h3>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium mb-2">Entry Emotion Distribution</h4>
            {entryDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No emotion data available
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={entryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`}
                    >
                      {entryDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={EMOTION_COLORS[entry.name] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} trades`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Entry Emotion Win Rate</h4>
            {entryEmotionData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No emotion data available
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={entryEmotionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : value}%`, 'Win Rate']} />
                    <Legend />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        
        {(bestEntryEmotion || worstEntryEmotion) && (
          <div className="bg-muted/20 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Emotional Impact Insights:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {bestEntryEmotion && (
                <div>
                  <p className="text-muted-foreground">Best performing entry emotion:</p>
                  <p className="font-medium">{bestEntryEmotion.name} - {bestEntryEmotion.winRate.toFixed(1)}% win rate</p>
                </div>
              )}
              
              {worstEntryEmotion && (
                <div>
                  <p className="text-muted-foreground">Worst performing entry emotion:</p>
                  <p className="font-medium">{worstEntryEmotion.name} - {worstEntryEmotion.winRate.toFixed(1)}% win rate</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Recommendations:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Consider journaling before trading to identify your emotional state</li>
                <li>Avoid trading when experiencing strong negative emotions</li>
                <li>Develop a pre-trade routine to help maintain emotional consistency</li>
                <li>Set clear rules for yourself about when to step away from trading</li>
              </ul>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-md font-medium mb-2">Exit Emotion Analysis</h4>
          {exitEmotionData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No exit emotion data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exitEmotionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => [
                    name === 'winRate' ? `${typeof value === 'number' ? value.toFixed(1) : value}%` : `₹${typeof value === 'number' ? value.toFixed(2) : value}`,
                    name === 'winRate' ? 'Win Rate' : 'Avg P&L'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="winRate" name="Win Rate %" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgPnL" name="Avg P&L (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
