
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
  Cell
} from "recharts";

interface EmotionPerformanceComparisonProps {
  trades: Trade[];
}

export function EmotionPerformanceComparison({ trades }: EmotionPerformanceComparisonProps) {
  // Group trades by entry emotion
  const entryEmotions = trades.reduce((acc, trade) => {
    if (!trade.entry_emotion) return acc;
    
    if (!acc[trade.entry_emotion]) {
      acc[trade.entry_emotion] = {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        avgPnL: 0,
        totalPnL: 0
      };
    }
    
    acc[trade.entry_emotion].totalTrades += 1;
    
    if (trade.outcome === 'profit') {
      acc[trade.entry_emotion].wins += 1;
    } else {
      acc[trade.entry_emotion].losses += 1;
    }
    
    const pnl = trade.exit_price && trade.entry_price ? 
      (trade.exit_price - trade.entry_price) * (trade.quantity || 1) * 
      (trade.trade_direction === 'short' ? -1 : 1) : 0;
    
    acc[trade.entry_emotion].totalPnL += pnl;
    
    return acc;
  }, {} as Record<string, { totalTrades: number; wins: number; losses: number; avgPnL: number; totalPnL: number }>);
  
  // Calculate average P&L
  Object.keys(entryEmotions).forEach(emotion => {
    entryEmotions[emotion].avgPnL = entryEmotions[emotion].totalPnL / entryEmotions[emotion].totalTrades;
  });
  
  // Prepare data for chart
  const winRateData = Object.entries(entryEmotions).map(([emotion, stats]) => ({
    name: emotion,
    winRate: stats.totalTrades > 0 ? (stats.wins / stats.totalTrades) * 100 : 0,
    avgPnL: stats.avgPnL,
    totalTrades: stats.totalTrades
  })).sort((a, b) => b.winRate - a.winRate);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Entry Emotion vs. Performance</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Comparison of how different entry emotions impact your trading win rate and average P&L.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Win Rate by Emotion</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={winRateData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${Number(value).toFixed(1)}%`, 'Win Rate']}
                  labelFormatter={(label) => `${label} (${winRateData.find(d => d.name === label)?.totalTrades || 0} trades)`}
                />
                <Bar 
                  dataKey="winRate" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]} 
                  name="Win Rate (%)" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Average P&L by Emotion</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={winRateData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${Number(value).toFixed(2)}`, 'Avg P&L']}
                  labelFormatter={(label) => `${label} (${winRateData.find(d => d.name === label)?.totalTrades || 0} trades)`}
                />
                <Bar 
                  dataKey="avgPnL" 
                  fill="#10b981"
                  radius={[0, 4, 4, 0]} 
                  name="Average P&L" 
                >
                  {winRateData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.avgPnL >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Key Insights</h4>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          {winRateData.length > 0 ? (
            <>
              <li>Best performing emotion: <span className="font-medium text-foreground">{winRateData[0].name}</span> with {winRateData[0].winRate.toFixed(1)}% win rate</li>
              {winRateData.length > 1 && (
                <li>Worst performing emotion: <span className="font-medium text-foreground">{winRateData[winRateData.length - 1].name}</span> with {winRateData[winRateData.length - 1].winRate.toFixed(1)}% win rate</li>
              )}
              <li>Emotions with positive average P&L: {winRateData.filter(d => d.avgPnL > 0).map(d => d.name).join(', ') || 'None'}</li>
            </>
          ) : (
            <li>No emotional data recorded for your trades yet. Start recording entry emotions to see insights here.</li>
          )}
        </ul>
      </div>
    </Card>
  );
}
