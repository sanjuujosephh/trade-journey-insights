
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
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface TechnicalIndicatorImpactProps {
  trades: Trade[];
}

export function TechnicalIndicatorImpact({ trades }: TechnicalIndicatorImpactProps) {
  // Analyze VWAP position impact
  const vwapPositionMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number 
  }>();
  
  // Analyze EMA position impact
  const emaPositionMap = new Map<string, { 
    wins: number; 
    losses: number; 
    totalPnL: number; 
    count: number 
  }>();
  
  trades.forEach(trade => {
    // Process VWAP position
    const vwapPos = trade.vwap_position || "Unknown";
    if (!vwapPositionMap.has(vwapPos)) {
      vwapPositionMap.set(vwapPos, { wins: 0, losses: 0, totalPnL: 0, count: 0 });
    }
    
    const vwapStats = vwapPositionMap.get(vwapPos)!;
    vwapStats.count += 1;
    
    if (trade.outcome === 'profit') {
      vwapStats.wins += 1;
    } else if (trade.outcome === 'loss') {
      vwapStats.losses += 1;
    }
    
    vwapStats.totalPnL += calculateTradePnL(trade);
    
    // Process EMA position
    const emaPos = trade.ema_position || "Unknown";
    if (!emaPositionMap.has(emaPos)) {
      emaPositionMap.set(emaPos, { wins: 0, losses: 0, totalPnL: 0, count: 0 });
    }
    
    const emaStats = emaPositionMap.get(emaPos)!;
    emaStats.count += 1;
    
    if (trade.outcome === 'profit') {
      emaStats.wins += 1;
    } else if (trade.outcome === 'loss') {
      emaStats.losses += 1;
    }
    
    emaStats.totalPnL += calculateTradePnL(trade);
  });
  
  // Prepare VWAP data for chart
  const vwapData = Array.from(vwapPositionMap.entries()).map(([position, stats]) => ({
    name: position,
    winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
    avgPnL: stats.count > 0 ? stats.totalPnL / stats.count : 0,
    trades: stats.count
  }));
  
  // Prepare EMA data for chart
  const emaData = Array.from(emaPositionMap.entries()).map(([position, stats]) => ({
    name: position,
    winRate: stats.count > 0 ? (stats.wins / stats.count) * 100 : 0,
    avgPnL: stats.count > 0 ? stats.totalPnL / stats.count : 0,
    trades: stats.count
  }));
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Technical Indicator Impact</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-md font-medium mb-2">VWAP Position Performance</h4>
          {vwapData.length === 0 || vwapData.every(d => d.name === "Unknown") ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No VWAP position data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vwapData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => [
                    name === 'winRate' ? `${value.toFixed(1)}%` : `₹${value.toFixed(2)}`,
                    name === 'winRate' ? 'Win Rate' : 'Avg P&L'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgPnL" name="Avg P&L (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2">EMA Position Performance</h4>
          {emaData.length === 0 || emaData.every(d => d.name === "Unknown") ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No EMA position data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip formatter={(value, name) => [
                    name === 'winRate' ? `${value.toFixed(1)}%` : `₹${value.toFixed(2)}`,
                    name === 'winRate' ? 'Win Rate' : 'Avg P&L'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="winRate" name="Win Rate (%)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="avgPnL" name="Avg P&L (₹)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        <div className="bg-muted/20 p-3 rounded-md text-sm">
          <p className="font-medium mb-1">Indicator Impact Insights:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Price position relative to VWAP can indicate momentum direction</li>
            <li>Trading in alignment with the EMA trend tends to increase success rate</li>
            <li>Technical indicator confluence (when multiple indicators align) can provide stronger signals</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
