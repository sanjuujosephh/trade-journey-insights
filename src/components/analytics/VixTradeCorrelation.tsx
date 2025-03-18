
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
  ZAxis
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface VixTradeCorrelationProps {
  trades: Trade[];
}

export function VixTradeCorrelation({ trades }: VixTradeCorrelationProps) {
  const profitTrades = trades
    .filter(trade => trade.outcome === 'profit' && trade.vix !== null && trade.vix !== undefined)
    .map(trade => ({
      vix: trade.vix || 0,
      pnl: ((trade.exit_price || 0) - (trade.entry_price || 0)) * (trade.quantity || 1),
      profit: true,
      size: 50  // Size for the scatter plot dot
    }));

  const lossTrades = trades
    .filter(trade => trade.outcome === 'loss' && trade.vix !== null && trade.vix !== undefined)
    .map(trade => ({
      vix: trade.vix || 0,
      pnl: ((trade.exit_price || 0) - (trade.entry_price || 0)) * (trade.quantity || 1),
      profit: false,
      size: 50  // Size for the scatter plot dot
    }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">VIX vs. Trade Performance</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This chart shows the relationship between market volatility (VIX) and your trade performance.
      </p>
      <div className="h-[400px]">
        <ChartContainer
          config={{
            profit: { color: "#10b981" },
            loss: { color: "#ef4444" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="vix" 
                name="VIX" 
                label={{ value: 'VIX Value', position: 'insideBottom', offset: -10 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <YAxis 
                dataKey="pnl" 
                name="P&L" 
                label={{ value: 'P&L', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis dataKey="size" range={[25, 200]} />
              <Tooltip 
                content={<ChartTooltipContent />}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend />
              <Scatter 
                name="Profitable Trades" 
                data={profitTrades} 
                fill="#10b981" 
                shape="circle" 
              />
              <Scatter 
                name="Losing Trades" 
                data={lossTrades} 
                fill="#ef4444" 
                shape="circle" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
}
