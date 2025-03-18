
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { parseISO, format, addDays, subDays } from "date-fns";

interface BehavioralTrendsProps {
  trades: Trade[];
}

export function BehavioralTrends({ trades }: BehavioralTrendsProps) {
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => {
    if (!a.entry_date || !b.entry_date) return 0;
    
    const [aDay, aMonth, aYear] = a.entry_date.split('-').map(Number);
    const [bDay, bMonth, bYear] = b.entry_date.split('-').map(Number);
    
    const dateA = new Date(aYear, aMonth - 1, aDay);
    const dateB = new Date(bYear, bMonth - 1, bDay);
    
    return dateA.getTime() - dateB.getTime();
  });
  
  // Group trades by date
  const tradesByDate = sortedTrades.reduce((acc, trade) => {
    if (!trade.entry_date) return acc;
    
    if (!acc[trade.entry_date]) {
      acc[trade.entry_date] = [];
    }
    
    acc[trade.entry_date].push(trade);
    return acc;
  }, {} as Record<string, Trade[]>);
  
  // Calculate metrics for each date
  const trendsData = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    // Parse date components
    const [day, month, year] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    // Calculate average stress level for the day
    const avgStress = dayTrades.reduce((sum, trade) => sum + (trade.stress_level || 5), 0) / dayTrades.length;
    
    // Calculate percentage of impulsive trades
    const impulsiveCount = dayTrades.filter(trade => trade.is_impulsive === true).length;
    const impulsivePercent = (impulsiveCount / dayTrades.length) * 100;
    
    // Calculate win rate for the day
    const winCount = dayTrades.filter(trade => trade.outcome === 'profit').length;
    const winRate = (winCount / dayTrades.length) * 100;
    
    // Calculate average confidence level
    const avgConfidence = dayTrades.reduce((sum, trade) => sum + (trade.confidence_level || 5), 0) / dayTrades.length;
    
    // Calculate average P&L for the day
    const totalPnL = dayTrades.reduce((sum, trade) => {
      const pnl = trade.exit_price && trade.entry_price ? 
        (trade.exit_price - trade.entry_price) * (trade.quantity || 1) * 
        (trade.trade_direction === 'short' ? -1 : 1) : 0;
      return sum + pnl;
    }, 0);
    const avgPnL = totalPnL / dayTrades.length;
    
    return {
      date: format(dateObj, 'MM/dd'),
      fullDate: format(dateObj, 'dd MMM yyyy'),
      avgStress,
      impulsivePercent,
      winRate,
      avgConfidence,
      avgPnL,
      trades: dayTrades.length
    };
  });
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Behavioral Trends Over Time</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Track how your trading behavior and performance change over time.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Stress Level vs. Win Rate</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(label) => {
                    const dataPoint = trendsData.find(item => item.date === label);
                    return dataPoint ? `${dataPoint.fullDate} (${dataPoint.trades} trades)` : label;
                  }}
                  formatter={(value, name) => {
                    if (name === 'avgStress') return [`${Number(value).toFixed(1)}/10`, 'Avg Stress'];
                    if (name === 'winRate') return [`${Number(value).toFixed(1)}%`, 'Win Rate'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgStress"
                  name="Avg Stress Level"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="winRate"
                  name="Win Rate"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine yAxisId="left" y={5} stroke="#6b7280" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Impulsive Decisions vs. P&L</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  labelFormatter={(label) => {
                    const dataPoint = trendsData.find(item => item.date === label);
                    return dataPoint ? `${dataPoint.fullDate} (${dataPoint.trades} trades)` : label;
                  }}
                  formatter={(value, name) => {
                    if (name === 'impulsivePercent') return [`${Number(value).toFixed(1)}%`, 'Impulsive %'];
                    if (name === 'avgPnL') return [`₹${Number(value).toFixed(2)}`, 'Avg P&L'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impulsivePercent"
                  name="Impulsive Decisions %"
                  stroke="#f59e0b"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgPnL"
                  name="Avg P&L"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine yAxisId="right" y={0} stroke="#6b7280" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium mb-2">Confidence Level Trend</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  labelFormatter={(label) => {
                    const dataPoint = trendsData.find(item => item.date === label);
                    return dataPoint ? `${dataPoint.fullDate} (${dataPoint.trades} trades)` : label;
                  }}
                  formatter={(value) => [`${Number(value).toFixed(1)}/10`, 'Avg Confidence']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  name="Avg Confidence Level"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <ReferenceLine y={5} stroke="#6b7280" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {trendsData.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Behavioral Insights</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {(() => {
              // Calculate correlations
              const stressWinCorrelation = calculateCorrelation(
                trendsData.map(d => d.avgStress),
                trendsData.map(d => d.winRate)
              );
              
              const impulsivePnLCorrelation = calculateCorrelation(
                trendsData.map(d => d.impulsivePercent),
                trendsData.map(d => d.avgPnL)
              );
              
              const confidenceWinCorrelation = calculateCorrelation(
                trendsData.map(d => d.avgConfidence),
                trendsData.map(d => d.winRate)
              );
              
              return (
                <>
                  <li>
                    Stress and win rate are {Math.abs(stressWinCorrelation) < 0.3 ? 'weakly' : 
                      Math.abs(stressWinCorrelation) < 0.7 ? 'moderately' : 'strongly'} {stressWinCorrelation < 0 ? 'negatively' : 'positively'} correlated
                    {stressWinCorrelation < -0.3 && '. Lower stress levels may improve your performance'}
                    {stressWinCorrelation > 0.3 && '. You seem to perform better under some stress'}
                  </li>
                  <li>
                    Impulsive decisions and P&L are {Math.abs(impulsivePnLCorrelation) < 0.3 ? 'weakly' : 
                      Math.abs(impulsivePnLCorrelation) < 0.7 ? 'moderately' : 'strongly'} {impulsivePnLCorrelation < 0 ? 'negatively' : 'positively'} correlated
                    {impulsivePnLCorrelation < -0.3 && '. Planned trades tend to be more profitable for you'}
                    {impulsivePnLCorrelation > 0.3 && '. Your intuitive trades seem to perform well'}
                  </li>
                  <li>
                    Confidence and win rate are {Math.abs(confidenceWinCorrelation) < 0.3 ? 'weakly' : 
                      Math.abs(confidenceWinCorrelation) < 0.7 ? 'moderately' : 'strongly'} {confidenceWinCorrelation < 0 ? 'negatively' : 'positively'} correlated
                    {confidenceWinCorrelation > 0.3 && '. Your confidence seems to be a good predictor of success'}
                    {confidenceWinCorrelation < -0.3 && '. Be cautious when feeling overconfident'}
                  </li>
                </>
              );
            })()}
          </ul>
        </div>
      )}
    </Card>
  );
}

// Helper function to calculate correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  
  // Calculate means
  const mean_x = x.reduce((sum, val) => sum + val, 0) / n;
  const mean_y = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate variances and covariance
  let variance_x = 0;
  let variance_y = 0;
  let covariance = 0;
  
  for (let i = 0; i < n; i++) {
    const diff_x = x[i] - mean_x;
    const diff_y = y[i] - mean_y;
    
    variance_x += diff_x ** 2;
    variance_y += diff_y ** 2;
    covariance += diff_x * diff_y;
  }
  
  variance_x /= n;
  variance_y /= n;
  covariance /= n;
  
  // Calculate correlation
  const std_x = Math.sqrt(variance_x);
  const std_y = Math.sqrt(variance_y);
  
  // Avoid division by zero
  if (std_x === 0 || std_y === 0) return 0;
  
  return covariance / (std_x * std_y);
}
