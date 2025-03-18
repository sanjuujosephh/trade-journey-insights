
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
} from "recharts";
import { calculateTradePnL } from "@/utils/calculations/pnl";

interface VolatilityImpactAnalysisProps {
  trades: Trade[];
}

export function VolatilityImpactAnalysis({ trades }: VolatilityImpactAnalysisProps) {
  // Prepare data for VIX impact analysis
  const vixData = trades
    .filter(trade => trade.vix !== null && trade.vix !== undefined)
    .map(trade => ({
      vix: trade.vix,
      pnl: calculateTradePnL(trade),
      outcome: trade.outcome,
      symbol: trade.symbol
    }));

  // Prepare data for IV impact analysis
  const ivData = trades
    .filter(trade => trade.call_iv !== null || trade.put_iv !== null)
    .map(trade => ({
      callIV: trade.call_iv,
      putIV: trade.put_iv,
      pnl: calculateTradePnL(trade),
      outcome: trade.outcome,
      symbol: trade.symbol
    }));

  // Prepare data for PCR impact analysis
  const pcrData = trades
    .filter(trade => trade.pcr !== null && trade.pcr !== undefined)
    .map(trade => ({
      pcr: trade.pcr,
      pnl: calculateTradePnL(trade),
      outcome: trade.outcome,
      symbol: trade.symbol
    }));

  // Process the data to find optimal VIX ranges
  const vixRanges = processVixData(vixData);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Volatility Impact Analysis</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-md font-medium mb-2">VIX vs Trade Performance</h4>
          {vixData.length < 3 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Not enough VIX data available (need at least 3 trades with VIX values)
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="vix" 
                    name="VIX" 
                    label={{ value: 'VIX Level', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="pnl" 
                    name="P&L" 
                    label={{ value: 'P&L', angle: -90, position: 'left' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => {
                      if (typeof value === 'number') {
                        return [
                          name === 'pnl' ? `₹${value.toFixed(2)}` : value,
                          name === 'pnl' ? 'P&L' : 'VIX'
                        ];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(value) => `VIX: ${value}`}
                  />
                  <Legend />
                  <Scatter 
                    name="Profit Trades" 
                    data={vixData.filter(d => d.outcome === 'profit')} 
                    fill="#82ca9d" 
                  />
                  <Scatter 
                    name="Loss Trades" 
                    data={vixData.filter(d => d.outcome === 'loss')} 
                    fill="#ff7373" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {vixRanges && (
            <div className="mt-4 bg-muted/20 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">VIX Analysis Insights:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Optimal VIX range for profitable trades: {vixRanges.optimalRange}</li>
                <li>Average P&L in optimal range: ₹{vixRanges.optimalRangePnL.toFixed(2)}</li>
                <li>Win rate in optimal range: {vixRanges.optimalRangeWinRate.toFixed(1)}%</li>
                <li>Avoid trading when VIX is: {vixRanges.avoidRange}</li>
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-2">PCR vs Trade Performance</h4>
          {pcrData.length < 3 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Not enough PCR data available (need at least 3 trades with PCR values)
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="pcr" 
                    name="PCR" 
                    label={{ value: 'Put-Call Ratio', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="pnl" 
                    name="P&L" 
                    label={{ value: 'P&L', angle: -90, position: 'left' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => {
                      if (typeof value === 'number') {
                        return [
                          name === 'pnl' ? `₹${value.toFixed(2)}` : value,
                          name === 'pnl' ? 'P&L' : 'PCR'
                        ];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(value) => `PCR: ${value}`}
                  />
                  <Legend />
                  <Scatter 
                    name="Profit Trades" 
                    data={pcrData.filter(d => d.outcome === 'profit')} 
                    fill="#82ca9d" 
                  />
                  <Scatter 
                    name="Loss Trades" 
                    data={pcrData.filter(d => d.outcome === 'loss')} 
                    fill="#ff7373" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function processVixData(vixData: any[]) {
  if (vixData.length < 3) return null;
  
  // Group trades by VIX range (in increments of 2)
  const rangeSize = 2;
  const rangeMap = new Map<string, { 
    trades: number,
    wins: number,
    totalPnL: number,
    avgPnL: number,
    winRate: number,
    minVix: number,
    maxVix: number
  }>();
  
  // Find min and max VIX
  const minVix = Math.floor(Math.min(...vixData.map(d => d.vix as number)));
  const maxVix = Math.ceil(Math.max(...vixData.map(d => d.vix as number)));
  
  // Create ranges
  for (let i = minVix; i < maxVix; i += rangeSize) {
    const rangeMin = i;
    const rangeMax = i + rangeSize;
    const rangeKey = `${rangeMin}-${rangeMax}`;
    
    const tradesInRange = vixData.filter(d => d.vix >= rangeMin && d.vix < rangeMax);
    const winsInRange = tradesInRange.filter(d => d.outcome === 'profit');
    const totalPnL = tradesInRange.reduce((sum, d) => sum + d.pnl, 0);
    
    if (tradesInRange.length > 0) {
      rangeMap.set(rangeKey, {
        trades: tradesInRange.length,
        wins: winsInRange.length,
        totalPnL,
        avgPnL: totalPnL / tradesInRange.length,
        winRate: (winsInRange.length / tradesInRange.length) * 100,
        minVix: rangeMin,
        maxVix: rangeMax
      });
    }
  }
  
  // Find the optimal range (highest win rate with at least 2 trades)
  let optimalRange = '';
  let optimalRangeWinRate = 0;
  let optimalRangePnL = 0;
  
  // Find the worst range (lowest win rate with at least 2 trades)
  let avoidRange = '';
  let avoidRangeWinRate = 100;
  
  rangeMap.forEach((stats, range) => {
    if (stats.trades >= 2) {
      if (stats.winRate > optimalRangeWinRate) {
        optimalRange = range;
        optimalRangeWinRate = stats.winRate;
        optimalRangePnL = stats.avgPnL;
      }
      
      if (stats.winRate < avoidRangeWinRate) {
        avoidRange = range;
        avoidRangeWinRate = stats.winRate;
      }
    }
  });
  
  return {
    optimalRange,
    optimalRangeWinRate,
    optimalRangePnL,
    avoidRange
  };
}
