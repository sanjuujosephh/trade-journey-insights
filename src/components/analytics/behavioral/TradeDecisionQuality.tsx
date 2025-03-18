
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

interface TradeDecisionQualityProps {
  trades: Trade[];
}

export function TradeDecisionQuality({ trades }: TradeDecisionQualityProps) {
  // Filter trades with plan_deviation data
  const tradesWithPlanData = trades.filter(
    trade => trade.plan_deviation !== null && trade.plan_deviation !== undefined
  );
  
  // Count of trades that followed plan vs deviated
  const followedPlan = tradesWithPlanData.filter(trade => trade.plan_deviation === false).length;
  const deviatedFromPlan = tradesWithPlanData.filter(trade => trade.plan_deviation === true).length;
  
  // Calculate win rates
  const followedPlanWins = tradesWithPlanData
    .filter(trade => trade.plan_deviation === false && trade.outcome === 'profit')
    .length;
    
  const deviatedWins = tradesWithPlanData
    .filter(trade => trade.plan_deviation === true && trade.outcome === 'profit')
    .length;
  
  const followedPlanWinRate = followedPlan > 0 ? (followedPlanWins / followedPlan) * 100 : 0;
  const deviatedWinRate = deviatedFromPlan > 0 ? (deviatedWins / deviatedFromPlan) * 100 : 0;
  
  // Prepare data for charts
  const planAdherenceData = [
    { name: 'Followed Plan', value: followedPlan },
    { name: 'Deviated from Plan', value: deviatedFromPlan }
  ];
  
  const winRateData = [
    { name: 'Followed Plan', value: followedPlanWinRate },
    { name: 'Deviated from Plan', value: deviatedWinRate }
  ];
  
  // Calcluate PnL data
  const followedPlanPnL = tradesWithPlanData
    .filter(trade => trade.plan_deviation === false)
    .reduce((sum, trade) => {
      const pnl = ((trade.exit_price || 0) - (trade.entry_price || 0)) * 
        (trade.quantity || 1) * (trade.trade_direction === 'short' ? -1 : 1);
      return sum + pnl;
    }, 0);
    
  const deviatedPnL = tradesWithPlanData
    .filter(trade => trade.plan_deviation === true)
    .reduce((sum, trade) => {
      const pnl = ((trade.exit_price || 0) - (trade.entry_price || 0)) * 
        (trade.quantity || 1) * (trade.trade_direction === 'short' ? -1 : 1);
      return sum + pnl;
    }, 0);
  
  const avgFollowedPnL = followedPlan > 0 ? followedPlanPnL / followedPlan : 0;
  const avgDeviatedPnL = deviatedFromPlan > 0 ? deviatedPnL / deviatedFromPlan : 0;
  
  const pnlData = [
    { name: 'Followed Plan', value: avgFollowedPnL },
    { name: 'Deviated from Plan', value: avgDeviatedPnL }
  ];
  
  // Monochrome color palette
  const COLORS = {
    primary: "#333333",
    secondary: "#777777",
    pieColors: ["#333333", "#999999"],
    gridLines: "#e0e0e0"
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Trade Decision Quality Analysis</h3>
      
      {tradesWithPlanData.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          No plan adherence data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-md font-medium mb-2">Plan Adherence</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planAdherenceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`
                    }
                  >
                    {planAdherenceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.pieColors[index]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} trades`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Win Rate by Plan Adherence</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={winRateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [
                    `${typeof value === 'number' ? Number(value).toFixed(1) : value}%`, 
                    'Win Rate'
                  ]} />
                  <Bar dataKey="value" name="Win Rate %" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Average P&L by Plan Adherence</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pnlData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gridLines} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [
                    `₹${typeof value === 'number' ? Number(value).toFixed(2) : value}`, 
                    'Avg P&L'
                  ]} />
                  <Bar dataKey="value" name="Avg P&L" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {tradesWithPlanData.length > 0 && (
        <div className="bg-muted/20 p-3 rounded-md text-sm">
          <p className="font-medium mb-1">Decision Quality Insights:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              Plan adherence rate: {tradesWithPlanData.length > 0 
                ? (followedPlan / tradesWithPlanData.length * 100).toFixed(1) 
                : 0}%
            </li>
            <li>
              {followedPlanWinRate > deviatedWinRate 
                ? 'Following your plan leads to a higher win rate'
                : 'Surprisingly, deviating from your plan has a higher win rate (this is unusual and worth examining)'}
            </li>
            <li>
              {avgFollowedPnL > avgDeviatedPnL
                ? 'Following your plan generates better average P&L'
                : 'Deviating from your plan shows higher average P&L (consider if your plan needs adjusting)'}
            </li>
            <li>
              Consistency in following trading plans is typically associated with long-term success
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
