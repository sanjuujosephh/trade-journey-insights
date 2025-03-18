
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface StressPerformanceCorrelationProps {
  trades: Trade[];
}

export function StressPerformanceCorrelation({ trades }: StressPerformanceCorrelationProps) {
  // Filter trades with stress level data
  const tradesWithStressData = trades.filter(
    trade => trade.stress_level !== null && trade.stress_level !== undefined
  );
  
  // Group trades by stress level
  const stressLevelMap = new Map<number, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number;
    avgPnL: number;
  }>();
  
  tradesWithStressData.forEach(trade => {
    const stressLevel = Number(trade.stress_level);
    
    if (!stressLevelMap.has(stressLevel)) {
      stressLevelMap.set(stressLevel, { 
        wins: 0, 
        losses: 0, 
        totalPnL: 0, 
        count: 0,
        avgPnL: 0
      });
    }
    
    const stats = stressLevelMap.get(stressLevel)!;
    stats.count += 1;
    
    if (trade.outcome === 'profit') {
      stats.wins += 1;
    } else if (trade.outcome === 'loss') {
      stats.losses += 1;
    }
    
    const pnl = calculateTradePnL(trade);
    stats.totalPnL += pnl;
    stats.avgPnL = stats.totalPnL / stats.count;
  });
  
  // Prepare data for charts
  const stressData = Array.from(stressLevelMap.entries())
    .map(([level, stats]) => ({
      stressLevel: level,
      winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
      avgPnL: stats.avgPnL,
      count: stats.count
    }))
    .sort((a, b) => a.stressLevel - b.stressLevel);
  
  // Scatter data with PnL per trade
  const scatterData = tradesWithStressData.map(trade => ({
    stressLevel: Number(trade.stress_level),
    pnl: calculateTradePnL(trade),
    outcome: trade.outcome,
    symbol: trade.symbol,
    id: trade.id
  }));
  
  // Analyze time pressure vs. performance
  const timePressureMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number;
    avgPnL: number;
  }>();
  
  trades.forEach(trade => {
    const timePressure = trade.time_pressure || "Unknown";
    
    if (!timePressureMap.has(timePressure)) {
      timePressureMap.set(timePressure, { 
        wins: 0, 
        losses: 0, 
        totalPnL: 0, 
        count: 0,
        avgPnL: 0
      });
    }
    
    const stats = timePressureMap.get(timePressure)!;
    stats.count += 1;
    
    if (trade.outcome === 'profit') {
      stats.wins += 1;
    } else if (trade.outcome === 'loss') {
      stats.losses += 1;
    }
    
    const pnl = calculateTradePnL(trade);
    stats.totalPnL += pnl;
    stats.avgPnL = stats.totalPnL / stats.count;
  });
  
  // Prepare time pressure data
  const timePressureData = Array.from(timePressureMap.entries())
    .map(([level, stats]) => ({
      name: level,
      winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
      avgPnL: stats.avgPnL,
      count: stats.count
    }));
  
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Stress Level Impact Analysis</h3>
        
        {tradesWithStressData.length < 3 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Not enough stress data available (need at least 3 trades with stress level entries)
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-2">Stress Level vs. Win Rate</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stressLevel" label={{ value: 'Stress Level', position: 'bottom' }} />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: 'Win Rate (%)', angle: -90, position: 'left' }} 
                    />
                    <Tooltip 
                      formatter={(value) => [
                        `${typeof value === 'number' ? value.toFixed(1) : value}%`, 
                        'Win Rate'
                      ]} 
                    />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">Stress Level vs. Trade P&L</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="stressLevel" 
                      name="Stress Level" 
                      domain={[0, 10]} 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="pnl" 
                      name="P&L" 
                    />
                    <Tooltip 
                      formatter={(value) => [
                        typeof value === 'number' ? 
                          (value % 1 === 0 ? value : value.toFixed(2)) : 
                          value, 
                        ''
                      ]} 
                    />
                    <Legend />
                    <Scatter 
                      name="Profitable Trades" 
                      data={scatterData.filter(d => d.outcome === 'profit')} 
                      fill="#82ca9d" 
                    />
                    <Scatter 
                      name="Loss Trades" 
                      data={scatterData.filter(d => d.outcome === 'loss')} 
                      fill="#ff7373" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Time Pressure Impact Analysis</h3>
        
        {timePressureData.length <= 1 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Not enough time pressure data available
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timePressureData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (typeof value === 'number') {
                        return [
                          name === 'winRate' ? `${value.toFixed(1)}%` : `₹${value.toFixed(2)}`,
                          name === 'winRate' ? 'Win Rate' : 'Avg P&L'
                        ];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgPnL" name="Avg P&L (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Time Pressure Insights:</p>
              
              {timePressureData.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {timePressureData.sort((a, b) => b.winRate - a.winRate).map((item, index) => (
                    <li key={index}>
                      {item.name} pressure: {item.winRate.toFixed(1)}% win rate with average P&L of ₹{item.avgPnL.toFixed(2)} ({item.count} trades)
                    </li>
                  ))}
                  <li className="mt-2 font-medium">
                    {
                      timePressureData.sort((a, b) => b.winRate - a.winRate)[0]?.name === 'low' 
                        ? 'Taking your time with trades appears to improve your results.'
                        : timePressureData.sort((a, b) => b.winRate - a.winRate)[0]?.name === 'high'
                        ? 'Interestingly, you perform better under high time pressure. This could indicate good instincts.'
                        : 'Your performance varies with time pressure. Consider analyzing what factors contribute to this pattern.'
                    }
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
