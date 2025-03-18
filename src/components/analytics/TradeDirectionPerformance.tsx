
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
  Cell,
} from "recharts";

interface TradeDirectionPerformanceProps {
  trades: Trade[];
}

export function TradeDirectionPerformance({ trades }: TradeDirectionPerformanceProps) {
  // Filter valid trades
  const validTrades = trades.filter(trade => 
    trade.trade_direction && 
    trade.outcome && 
    trade.exit_price !== null && 
    trade.entry_price !== null
  );
  
  // Separate by direction
  const longTrades = validTrades.filter(trade => trade.trade_direction === 'long');
  const shortTrades = validTrades.filter(trade => trade.trade_direction === 'short');
  
  // Calculate statistics
  const longWins = longTrades.filter(trade => trade.outcome === 'profit').length;
  const longLosses = longTrades.filter(trade => trade.outcome === 'loss').length;
  const shortWins = shortTrades.filter(trade => trade.outcome === 'profit').length;
  const shortLosses = shortTrades.filter(trade => trade.outcome === 'loss').length;
  
  const longWinRate = longTrades.length > 0 ? (longWins / longTrades.length) * 100 : 0;
  const shortWinRate = shortTrades.length > 0 ? (shortWins / shortTrades.length) * 100 : 0;
  
  // Calculate P&L
  const calculatePnL = (trades: Trade[]) => {
    return trades.reduce((sum, trade) => {
      const pnl = ((trade.exit_price || 0) - (trade.entry_price || 0)) * (trade.quantity || 1) * 
        (trade.trade_direction === 'short' ? -1 : 1);
      return sum + pnl;
    }, 0);
  };
  
  const longPnL = calculatePnL(longTrades);
  const shortPnL = calculatePnL(shortTrades);
  
  // Prepare data for charts
  const winRateData = [
    { name: 'Long', value: longWinRate, count: longTrades.length },
    { name: 'Short', value: shortWinRate, count: shortTrades.length }
  ];
  
  const pnlData = [
    { name: 'Long', value: longPnL },
    { name: 'Short', value: shortPnL }
  ];
  
  const frequencyData = [
    { name: 'Long', wins: longWins, losses: longLosses },
    { name: 'Short', wins: shortWins, losses: shortLosses }
  ];
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Trade Direction Performance</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Analysis of your performance based on trade direction (long vs short).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Win Rate by Direction</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
                  labelFormatter={(label) => `${label} (${winRateData.find(d => d.name === label)?.count || 0} trades)`}
                />
                <Bar dataKey="value">
                  {winRateData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Long' ? '#3b82f6' : '#a855f7'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">P&L by Direction</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: 'P&L', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'P&L']}
                />
                <Bar dataKey="value">
                  {pnlData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium mb-2">Win/Loss Distribution by Direction</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Number of Trades', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" name="Winning Trades" stackId="a" fill="#10b981" />
                <Bar dataKey="losses" name="Losing Trades" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
