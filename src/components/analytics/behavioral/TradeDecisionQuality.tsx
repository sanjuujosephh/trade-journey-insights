
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

interface TradeDecisionQualityProps {
  trades: Trade[];
}

export function TradeDecisionQuality({ trades }: TradeDecisionQualityProps) {
  // Analyze impulsive vs. planned trades
  const impulsiveTradesStats = {
    wins: 0,
    losses: 0,
    totalPnL: 0,
    count: 0,
  };

  const plannedTradesStats = {
    wins: 0,
    losses: 0,
    totalPnL: 0,
    count: 0,
  };

  // Count trades with plan deviation
  const planDeviationStats = {
    wins: 0,
    losses: 0,
    totalPnL: 0,
    count: 0,
  };

  const planAdherenceStats = {
    wins: 0,
    losses: 0,
    totalPnL: 0,
    count: 0,
  };

  trades.forEach(trade => {
    const pnl = calculateTradePnL(trade);
    const isWin = trade.outcome === 'profit';
    
    // Analyze impulsive trades
    if (trade.is_impulsive) {
      impulsiveTradesStats.count++;
      impulsiveTradesStats.totalPnL += pnl;
      if (isWin) impulsiveTradesStats.wins++;
      else impulsiveTradesStats.losses++;
    } else {
      plannedTradesStats.count++;
      plannedTradesStats.totalPnL += pnl;
      if (isWin) plannedTradesStats.wins++;
      else plannedTradesStats.losses++;
    }
    
    // Analyze plan deviation
    if (trade.plan_deviation) {
      planDeviationStats.count++;
      planDeviationStats.totalPnL += pnl;
      if (isWin) planDeviationStats.wins++;
      else planDeviationStats.losses++;
    } else {
      planAdherenceStats.count++;
      planAdherenceStats.totalPnL += pnl;
      if (isWin) planAdherenceStats.wins++;
      else planAdherenceStats.losses++;
    }
  });

  // Prepare data for charts
  const impulseVsPlannedData = [
    {
      name: "Impulsive Trades",
      winRate: impulsiveTradesStats.count > 0 
        ? (impulsiveTradesStats.wins / impulsiveTradesStats.count) * 100
        : 0,
      avgPnL: impulsiveTradesStats.count > 0
        ? impulsiveTradesStats.totalPnL / impulsiveTradesStats.count
        : 0,
      count: impulsiveTradesStats.count
    },
    {
      name: "Planned Trades",
      winRate: plannedTradesStats.count > 0
        ? (plannedTradesStats.wins / plannedTradesStats.count) * 100
        : 0,
      avgPnL: plannedTradesStats.count > 0
        ? plannedTradesStats.totalPnL / plannedTradesStats.count
        : 0,
      count: plannedTradesStats.count
    }
  ];

  const deviationVsAdherenceData = [
    {
      name: "Deviated from Plan",
      winRate: planDeviationStats.count > 0
        ? (planDeviationStats.wins / planDeviationStats.count) * 100
        : 0,
      avgPnL: planDeviationStats.count > 0
        ? planDeviationStats.totalPnL / planDeviationStats.count
        : 0,
      count: planDeviationStats.count
    },
    {
      name: "Followed Plan",
      winRate: planAdherenceStats.count > 0
        ? (planAdherenceStats.wins / planAdherenceStats.count) * 100
        : 0,
      avgPnL: planAdherenceStats.count > 0
        ? planAdherenceStats.totalPnL / planAdherenceStats.count
        : 0,
      count: planAdherenceStats.count
    }
  ];

  // Pie chart data and colors
  const pieData = [
    { name: "Impulsive", value: impulsiveTradesStats.count },
    { name: "Planned", value: plannedTradesStats.count }
  ].filter(item => item.value > 0);

  const pieColors = ["#FFA500", "#00C49F"];

  // Distribution of satisfaction by trade outcome
  const satisfactionByOutcome = new Map<string, number[]>();
  
  trades.forEach(trade => {
    if (trade.satisfaction_score === null || trade.satisfaction_score === undefined) return;
    
    const outcome = trade.outcome || "unknown";
    if (!satisfactionByOutcome.has(outcome)) {
      satisfactionByOutcome.set(outcome, []);
    }
    
    satisfactionByOutcome.get(outcome)!.push(Number(trade.satisfaction_score));
  });
  
  // Calculate average satisfaction by outcome
  const satisfactionData = Array.from(satisfactionByOutcome.entries()).map(([outcome, scores]) => ({
    name: outcome === "profit" ? "Profitable Trades" : "Loss Trades",
    avgSatisfaction: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0,
    count: scores.length
  }));

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Impulse vs. Planned Trade Analysis</h3>
        
        {impulsiveTradesStats.count === 0 && plannedTradesStats.count === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No impulse vs. planned trade data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={impulseVsPlannedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            
            <div className="h-64">
              <h4 className="text-md font-medium mb-2">Trade Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} trades`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Plan Adherence Analysis</h3>
        
        {planDeviationStats.count === 0 && planAdherenceStats.count === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No plan adherence data available
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deviationVsAdherenceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              <p className="font-medium mb-1">Decision Quality Insights:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  Planned trades have a 
                  {plannedTradesStats.count > 0 && impulsiveTradesStats.count > 0 
                    ? ` ${Math.abs(
                        ((plannedTradesStats.wins / plannedTradesStats.count) * 100) - 
                        ((impulsiveTradesStats.wins / impulsiveTradesStats.count) * 100)
                      ).toFixed(1)}% ${
                        (plannedTradesStats.wins / plannedTradesStats.count) > 
                        (impulsiveTradesStats.wins / impulsiveTradesStats.count) 
                          ? 'higher' 
                          : 'lower'
                      } win rate`
                    : ' different win rate'
                  } compared to impulsive trades
                </li>
                <li>
                  Following your trading plan results in 
                  {planAdherenceStats.count > 0 && planDeviationStats.count > 0
                    ? ` ${Math.abs(
                        (planAdherenceStats.totalPnL / planAdherenceStats.count) - 
                        (planDeviationStats.totalPnL / planDeviationStats.count)
                      ).toFixed(2)} ₹ ${
                        (planAdherenceStats.totalPnL / planAdherenceStats.count) > 
                        (planDeviationStats.totalPnL / planDeviationStats.count)
                          ? 'higher'
                          : 'lower'
                      } average P&L`
                    : ' different average P&L'
                  } compared to deviating from it
                </li>
                <li>
                  {
                    planAdherenceStats.count > 0 && planDeviationStats.count > 0 &&
                    (planAdherenceStats.wins / planAdherenceStats.count) > 
                    (planDeviationStats.wins / planDeviationStats.count)
                      ? 'Your trade plan is working well - continue to follow it for better results'
                      : 'Your trade plan might need revision as deviations are performing better'
                  }
                </li>
              </ul>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Satisfaction Analysis</h3>
        
        {satisfactionData.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No satisfaction score data available
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={satisfactionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} label={{ value: 'Avg. Satisfaction (1-10)', angle: -90, position: 'left' }} />
                  <Tooltip formatter={(value) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value}`, 
                    'Avg. Satisfaction'
                  ]} />
                  <Legend />
                  <Bar dataKey="avgSatisfaction" name="Avg. Satisfaction" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Satisfaction Insights:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {satisfactionData.map((item, index) => (
                  <li key={index}>
                    Average satisfaction for {item.name.toLowerCase()}: {item.avgSatisfaction.toFixed(1)}/10 
                    (from {item.count} trades)
                  </li>
                ))}
                {satisfactionData.length > 1 && (
                  <li className="mt-2 font-medium">
                    {
                      Math.abs(satisfactionData[0].avgSatisfaction - satisfactionData[1].avgSatisfaction) > 3
                        ? "There's a significant gap between your satisfaction levels for wins vs. losses."
                        : "Your satisfaction levels are relatively consistent regardless of outcome."
                    }
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
