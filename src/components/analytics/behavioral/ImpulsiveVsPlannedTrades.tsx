
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ImpulsiveVsPlannedTradesProps {
  trades: Trade[];
}

export function ImpulsiveVsPlannedTrades({ trades }: ImpulsiveVsPlannedTradesProps) {
  // Filter trades with impulsive flag set
  const tradesWithImpulsiveData = trades.filter(trade => trade.is_impulsive !== null && trade.is_impulsive !== undefined);
  
  // If no trades have impulsive data, show a message
  if (tradesWithImpulsiveData.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-2">Impulsive vs Planned Trades</h3>
        <p className="text-sm text-muted-foreground">
          No data available for impulsive vs planned trades. Start recording whether your trades are impulsive to see analysis here.
        </p>
      </Card>
    );
  }
  
  // Count impulsive vs planned trades
  const impulsiveTrades = tradesWithImpulsiveData.filter(trade => trade.is_impulsive === true);
  const plannedTrades = tradesWithImpulsiveData.filter(trade => trade.is_impulsive === false);
  
  // Calculate win rates
  const impulsiveWins = impulsiveTrades.filter(trade => trade.outcome === 'profit').length;
  const plannedWins = plannedTrades.filter(trade => trade.outcome === 'profit').length;
  
  const impulsiveWinRate = impulsiveTrades.length > 0 ? (impulsiveWins / impulsiveTrades.length) * 100 : 0;
  const plannedWinRate = plannedTrades.length > 0 ? (plannedWins / plannedTrades.length) * 100 : 0;
  
  // Calculate average P&L
  const calculateAvgPnL = (tradesList: Trade[]) => {
    if (tradesList.length === 0) return 0;
    
    const totalPnL = tradesList.reduce((sum, trade) => {
      const pnl = trade.exit_price && trade.entry_price ? 
        (trade.exit_price - trade.entry_price) * (trade.quantity || 1) * 
        (trade.trade_direction === 'short' ? -1 : 1) : 0;
      return sum + pnl;
    }, 0);
    
    return totalPnL / tradesList.length;
  };
  
  const impulsiveAvgPnL = calculateAvgPnL(impulsiveTrades);
  const plannedAvgPnL = calculateAvgPnL(plannedTrades);
  
  // Prepare data for pie chart
  const distributionData = [
    { name: 'Impulsive', value: impulsiveTrades.length },
    { name: 'Planned', value: plannedTrades.length }
  ];
  
  const COLORS = ['#ef4444', '#3b82f6'];
  
  // Prepare comparison data
  const comparisonData = [
    { 
      type: 'Impulsive',
      trades: impulsiveTrades.length,
      winRate: impulsiveWinRate.toFixed(1) + '%',
      avgPnL: '₹' + impulsiveAvgPnL.toFixed(2),
      color: '#ef4444'
    },
    { 
      type: 'Planned',
      trades: plannedTrades.length,
      winRate: plannedWinRate.toFixed(1) + '%',
      avgPnL: '₹' + plannedAvgPnL.toFixed(2),
      color: '#3b82f6'
    }
  ];
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Impulsive vs Planned Trades</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Analysis of your impulsive vs planned trading decisions and their impact on performance.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Trade Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Number of Trades']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Performance Comparison</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Trades</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="text-right">Avg P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row) => (
                <TableRow key={row.type}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: row.color }}
                      />
                      {row.type}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.trades}</TableCell>
                  <TableCell className="text-right">{row.winRate}</TableCell>
                  <TableCell 
                    className={`text-right ${parseFloat(row.avgPnL.slice(1)) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {row.avgPnL}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Key Findings</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                {plannedWinRate > impulsiveWinRate ? 
                  'Planned trades outperform impulsive trades in win rate' : 
                  'Surprisingly, impulsive trades have a higher win rate than planned trades'}
              </li>
              <li>
                {plannedAvgPnL > impulsiveAvgPnL ?
                  'Planned trades generate higher average P&L' :
                  'Impulsive trades show higher average P&L, contrary to typical expectations'}
              </li>
              <li>
                {impulsiveTrades.length > plannedTrades.length ?
                  'Most of your trades are impulsive - consider more planning' :
                  'You trade mostly with planning, which is a positive habit'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
