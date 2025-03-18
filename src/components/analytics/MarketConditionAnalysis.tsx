
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface MarketConditionAnalysisProps {
  trades: Trade[];
}

export function MarketConditionAnalysis({ trades }: MarketConditionAnalysisProps) {
  // Group trades by market condition
  const conditionMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    trades: number;
    avgPnL: number;
  }>();
  
  trades.forEach(trade => {
    const condition = trade.market_condition || "Unknown";
    
    if (!conditionMap.has(condition)) {
      conditionMap.set(condition, { 
        wins: 0, 
        losses: 0, 
        totalPnL: 0, 
        trades: 0,
        avgPnL: 0
      });
    }
    
    const stats = conditionMap.get(condition)!;
    stats.trades += 1;
    
    if (trade.outcome === 'profit') {
      stats.wins += 1;
    } else if (trade.outcome === 'loss') {
      stats.losses += 1;
    }
    
    const pnl = calculateTradePnL(trade);
    stats.totalPnL += pnl;
    stats.avgPnL = stats.totalPnL / stats.trades;
  });
  
  // Convert to array for charts
  const conditionData = Array.from(conditionMap.entries()).map(([condition, stats]) => ({
    name: condition,
    winRate: stats.trades > 0 ? (stats.wins / stats.trades) * 100 : 0,
    totalPnL: stats.totalPnL,
    trades: stats.trades,
    avgPnL: stats.avgPnL,
    value: stats.trades
  }));
  
  // Data for pie chart
  const pieData = conditionData.map(item => ({
    name: item.name,
    value: item.trades
  }));
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Market Condition Analysis</h3>
      
      {conditionData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No market condition data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Trade Distribution by Market Condition</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} trades`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-64">
            <h4 className="text-sm font-medium mb-2">Win Rate by Market Condition</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conditionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [
                  `${typeof value === 'number' ? value.toFixed(1) : value}%`, 
                  'Win Rate'
                ]} />
                <Bar dataKey="winRate" name="Win Rate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-medium mb-2">Performance Metrics by Market Condition</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {conditionData.map((condition) => (
                <Card key={condition.name} className="p-3">
                  <div className="text-sm font-medium truncate">{condition.name}</div>
                  <div className="mt-1 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Win Rate: <span className="font-semibold">{condition.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg P&L: <span className={`font-semibold ${condition.avgPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{condition.avgPnL.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Trades: <span className="font-semibold">{condition.trades}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
