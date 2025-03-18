
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface DevotionScoreAnalysisProps {
  trades: Trade[];
}

export function DevotionScoreAnalysis({ trades }: DevotionScoreAnalysisProps) {
  // Filter trades with dates and sort them
  const sortedTrades = [...trades]
    .filter(trade => trade.entry_date)
    .sort((a, b) => {
      if (!a.entry_date || !b.entry_date) return 0;
      // Convert DD-MM-YYYY to Date objects
      const [aDay, aMonth, aYear] = a.entry_date.split('-').map(Number);
      const [bDay, bMonth, bYear] = b.entry_date.split('-').map(Number);
      return new Date(aYear, aMonth - 1, aDay).getTime() - new Date(bYear, bMonth - 1, bDay).getTime();
    });
  
  // Calculate devotion score for each trade
  // Devotion score = adherence to plan + lack of impulsiveness + satisfaction with results
  const tradeScores = sortedTrades.map(trade => {
    // Base score starts at 5 (out of 10)
    let score = 5;
    
    // Plan adherence: +3 if followed plan, -2 if deviated
    if (trade.plan_deviation === false) score += 3;
    else if (trade.plan_deviation === true) score -= 2;
    
    // Impulsiveness: -3 if impulsive, +2 if planned
    if (trade.is_impulsive === true) score -= 3;
    else if (trade.is_impulsive === false) score += 2;
    
    // Satisfaction: Add up to +/-2 based on satisfaction score
    if (trade.satisfaction_score !== null && trade.satisfaction_score !== undefined) {
      const satisfactionImpact = ((Number(trade.satisfaction_score) - 5) / 5) * 2;
      score += satisfactionImpact;
    }
    
    // Clamp score between 0 and 10
    score = Math.max(0, Math.min(10, score));
    
    // Extract date for the chart
    let dateLabel = 'Unknown';
    if (trade.entry_date) {
      const [day, month, year] = trade.entry_date.split('-');
      dateLabel = `${day}/${month}`;
    }
    
    return {
      id: trade.id,
      date: dateLabel,
      score: score,
      pnl: calculateTradePnL(trade),
      outcome: trade.outcome,
      followed_plan: !trade.plan_deviation,
      planned_trade: !trade.is_impulsive,
      satisfactionScore: trade.satisfaction_score ? Number(trade.satisfaction_score) : null
    };
  });
  
  // Calculate overall discipline metrics
  const disciplineData = {
    avgScore: tradeScores.reduce((sum, trade) => sum + trade.score, 0) / tradeScores.length || 0,
    planAdherence: (tradeScores.filter(t => t.followed_plan).length / tradeScores.length) * 100 || 0,
    plannedTrades: (tradeScores.filter(t => t.planned_trade).length / tradeScores.length) * 100 || 0,
    avgSatisfaction: tradeScores.reduce((sum, trade) => sum + (trade.satisfactionScore || 0), 0) / 
      tradeScores.filter(t => t.satisfactionScore !== null).length || 0
  };
  
  // Prepare radar chart data
  const radarData = [
    {
      subject: 'Plan Adherence',
      A: disciplineData.planAdherence / 10,
      fullMark: 10,
    },
    {
      subject: 'Planned Trades',
      A: disciplineData.plannedTrades / 10,
      fullMark: 10,
    },
    {
      subject: 'Satisfaction',
      A: disciplineData.avgSatisfaction,
      fullMark: 10,
    },
    {
      subject: 'Discipline Score',
      A: disciplineData.avgScore,
      fullMark: 10,
    },
  ];
  
  // Monochrome color palette
  const COLORS = {
    line: "#333333",
    gridLines: "#e0e0e0",
    radar: "#555555",
    radarFill: "rgba(85, 85, 85, 0.6)"
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Discipline Score Analysis</h3>
        
        {tradeScores.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No discipline data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-2">Discipline Score Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={tradeScores.slice(-20)} // Show last 20 trades for clarity
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      formatter={(value) => [
                        `${typeof value === 'number' ? value.toFixed(1) : value}`, 
                        'Discipline Score'
                      ]} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="Discipline Score" 
                      stroke={COLORS.line} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">Trading Discipline Radar</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke={COLORS.gridLines} />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Trader"
                      dataKey="A"
                      stroke={COLORS.radar}
                      fill={COLORS.radarFill}
                    />
                    <Tooltip formatter={(value) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value}/10`, 
                      ''
                    ]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Discipline Metrics</h3>
        
        {tradeScores.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No discipline data available
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border p-3 rounded-md">
                <div className="text-sm font-medium">Overall Discipline Score</div>
                <div className="mt-1 text-2xl font-bold">
                  {disciplineData.avgScore.toFixed(1)}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on plan adherence, planning, and satisfaction
                </div>
              </div>
              
              <div className="border p-3 rounded-md">
                <div className="text-sm font-medium">Plan Adherence</div>
                <div className="mt-1 text-2xl font-bold">
                  {disciplineData.planAdherence.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Percentage of trades following your plan
                </div>
              </div>
              
              <div className="border p-3 rounded-md">
                <div className="text-sm font-medium">Planned Trades</div>
                <div className="mt-1 text-2xl font-bold">
                  {disciplineData.plannedTrades.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Percentage of non-impulsive trades
                </div>
              </div>
              
              <div className="border p-3 rounded-md">
                <div className="text-sm font-medium">Avg. Satisfaction</div>
                <div className="mt-1 text-2xl font-bold">
                  {disciplineData.avgSatisfaction.toFixed(1)}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  Average satisfaction with trade outcomes
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Discipline Analysis Insights:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  {
                    disciplineData.avgScore >= 8 
                      ? 'You demonstrate excellent trading discipline. Keep maintaining this approach.'
                      : disciplineData.avgScore >= 6
                      ? 'Your trading discipline is good but has room for improvement.'
                      : 'Your trading discipline needs significant improvement to achieve better results.'
                  }
                </li>
                <li>
                  {
                    disciplineData.planAdherence < 60
                      ? 'You frequently deviate from your trading plans. Work on better plan adherence.'
                      : disciplineData.planAdherence >= 80
                      ? 'You show strong commitment to following your trading plans.'
                      : 'Your plan adherence is moderate. Try to be more consistent.'
                  }
                </li>
                <li>
                  {
                    disciplineData.plannedTrades < 50
                      ? 'Too many impulsive trades detected. Develop a more methodical approach.'
                      : disciplineData.plannedTrades >= 80
                      ? 'Most of your trades are well-planned, which is excellent.'
                      : 'You balance between planned and impulsive trades. Aim for more planning.'
                  }
                </li>
                {
                  tradeScores.length >= 3 && (
                    <li>
                      {
                        tradeScores.slice(-3).every(t => t.score > disciplineData.avgScore)
                          ? 'Your recent discipline scores show improvement. Great job!'
                          : tradeScores.slice(-3).every(t => t.score < disciplineData.avgScore)
                          ? 'Your recent discipline scores are declining. Pay attention to this trend.'
                          : 'Your discipline scores fluctuate. Try to establish more consistency.'
                      }
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
