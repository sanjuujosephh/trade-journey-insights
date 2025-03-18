
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
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface BehavioralTrendsProps {
  trades: Trade[];
}

export function BehavioralTrends({ trades }: BehavioralTrendsProps) {
  // Filter trades with dates and sort them chronologically
  const sortedTrades = [...trades]
    .filter(trade => trade.entry_date)
    .sort((a, b) => {
      if (!a.entry_date || !b.entry_date) return 0;
      const [aDay, aMonth, aYear] = a.entry_date.split('-').map(Number);
      const [bDay, bMonth, bYear] = b.entry_date.split('-').map(Number);
      return new Date(aYear, aMonth - 1, aDay).getTime() - new Date(bYear, bMonth - 1, bDay).getTime();
    });

  // Calculate discipline scores for each trade
  const tradeScores = sortedTrades.map(trade => {
    // Calculate a simplified discipline score
    let score = 0;
    
    // Plan adherence
    if (trade.plan_deviation === false) score += 2;
    else if (trade.plan_deviation === true) score -= 2;
    
    // Impulsiveness
    if (trade.is_impulsive === false) score += 2;
    else if (trade.is_impulsive === true) score -= 2;
    
    // Trade outcome
    if (trade.outcome === 'profit') score += 1;
    else if (trade.outcome === 'loss') score -= 1;
    
    // Satisfaction score
    if (trade.satisfaction_score !== null && trade.satisfaction_score !== undefined) {
      score += (Number(trade.satisfaction_score) - 5) / 2;
    }
    
    // Extract date for the chart
    let dateLabel = 'Unknown';
    if (trade.entry_date) {
      const [day, month] = trade.entry_date.split('-');
      dateLabel = `${day}/${month}`;
    }
    
    return {
      date: dateLabel,
      score,
      pnl: calculateTradePnL(trade),
      emotions: trade.entry_emotion || 'Unknown'
    };
  });
  
  // Calculate weekly aggregates
  const weeklyData = [];
  const weeksMap = new Map();
  
  sortedTrades.forEach(trade => {
    if (!trade.entry_date) return;
    
    const [day, month, year] = trade.entry_date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Get the week start date (Monday)
    const weekStart = new Date(date);
    const dayOfWeek = date.getDay() || 7; // Convert Sunday (0) to 7
    weekStart.setDate(date.getDate() - dayOfWeek + 1);
    
    const weekKey = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`;
    
    if (!weeksMap.has(weekKey)) {
      weeksMap.set(weekKey, {
        weekStart: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        trades: 0,
        impulsive: 0,
        plannedDeviations: 0,
        avgSatisfaction: 0,
        totalSatisfaction: 0,
        pnl: 0
      });
    }
    
    const weekData = weeksMap.get(weekKey);
    weekData.trades += 1;
    if (trade.is_impulsive === true) weekData.impulsive += 1;
    if (trade.plan_deviation === true) weekData.plannedDeviations += 1;
    if (trade.satisfaction_score !== null && trade.satisfaction_score !== undefined) {
      weekData.totalSatisfaction += Number(trade.satisfaction_score);
    }
    weekData.pnl += calculateTradePnL(trade);
  });
  
  // Calculate averages and sort by week
  Array.from(weeksMap.entries()).forEach(([key, data]) => {
    data.avgSatisfaction = data.totalSatisfaction / data.trades || 0;
    data.impulsiveRate = (data.impulsive / data.trades) * 100;
    data.deviationRate = (data.plannedDeviations / data.trades) * 100;
    weeklyData.push(data);
  });
  
  weeklyData.sort((a, b) => {
    const [aDay, aMonth] = a.weekStart.split('/').map(Number);
    const [bDay, bMonth] = b.weekStart.split('/').map(Number);
    if (aMonth !== bMonth) return aMonth - bMonth;
    return aDay - bDay;
  });
  
  // Monochrome color palette
  const COLORS = {
    primary: "#333333",
    secondary: "#777777",
    tertiary: "#999999",
    gridLines: "#e0e0e0"
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Behavioral Trends Over Time</h3>
      
      {tradeScores.length < 5 ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Not enough data available for behavioral trends (need at least 5 trades)
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h4 className="text-md font-medium mb-2">Discipline Score Trend</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={tradeScores}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      typeof value === 'number' ? 
                        Number(value).toFixed(2) : 
                        value, 
                      ''
                    ]} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Discipline Score" 
                    stroke={COLORS.primary} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pnl" 
                    name="P&L" 
                    stroke={COLORS.secondary} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {weeklyData.length >= 2 && (
            <div>
              <h4 className="text-md font-medium mb-2">Weekly Behavioral Metrics</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={weeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                    <XAxis dataKey="weekStart" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value) => [
                        typeof value === 'number' ? 
                          (value % 1 === 0 ? value : Number(value).toFixed(2)) : 
                          value, 
                        ''
                      ]} 
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="impulsiveRate" 
                      name="Impulsive Trades (%)" 
                      stroke={COLORS.primary} 
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="deviationRate" 
                      name="Plan Deviations (%)" 
                      stroke={COLORS.secondary} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="avgSatisfaction" 
                      name="Satisfaction (1-10)" 
                      stroke={COLORS.tertiary}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          <div className="bg-muted/20 p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Behavioral Trends Insights:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {weeklyData.length >= 2 && (
                <>
                  <li>
                    {
                      weeklyData[weeklyData.length - 1].impulsiveRate < weeklyData[0].impulsiveRate
                        ? 'Your impulsive trading is decreasing over time, which is positive.'
                        : 'Your impulsive trading rate has increased. Consider implementing more structured decision-making.'
                    }
                  </li>
                  <li>
                    {
                      weeklyData[weeklyData.length - 1].deviationRate < weeklyData[0].deviationRate
                        ? 'You\'re becoming more consistent with following your trading plans.'
                        : 'Plan deviations are increasing. Review why you\'re deviating from your plans.'
                    }
                  </li>
                </>
              )}
              <li>
                {
                  tradeScores.length >= 10 && tradeScores.slice(-5).every(t => t.score > 0)
                    ? 'Your recent behavioral discipline is positive.'
                    : tradeScores.length >= 10 && tradeScores.slice(-5).every(t => t.score < 0)
                    ? 'Your recent behavioral discipline needs improvement.'
                    : 'Your behavioral discipline is inconsistent. Focus on developing stable trading habits.'
                }
              </li>
              <li>Behavioral consistency is a key factor in achieving long-term trading success.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
