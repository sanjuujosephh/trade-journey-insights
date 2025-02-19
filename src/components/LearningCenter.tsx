
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function LearningCenter() {
  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      return data;
    },
  });

  // Analyze losing trades to identify patterns
  const losingTrades = trades.filter(trade => 
    trade.outcome === "loss" && trade.exit_price && trade.quantity
  );

  const patterns = [
    {
      pattern: "Early Exit in Profit",
      frequency: trades.filter(t => 
        t.exit_price && t.stop_loss && t.exit_price < t.stop_loss && t.outcome === "profit"
      ).length,
      suggestion: "Consider letting profits run with trailing stop loss"
    },
    {
      pattern: "Stop Loss Hit",
      frequency: trades.filter(t => 
        t.exit_price && t.stop_loss && t.exit_price <= t.stop_loss && t.outcome === "loss"
      ).length,
      suggestion: "Review stop loss placement strategy"
    },
    {
      pattern: "No Stop Loss",
      frequency: trades.filter(t => !t.stop_loss).length,
      suggestion: "Always use a stop loss to manage risk"
    },
    {
      pattern: "Overtrading",
      frequency: trades.filter(t => 
        trades.filter(trade => 
          new Date(trade.timestamp).toDateString() === new Date(t.timestamp).toDateString()
        ).length > 2
      ).length,
      suggestion: "Limit daily trades to avoid overtrading"
    }
  ];

  // Format losing trades for display
  const recentMistakes = losingTrades.slice(0, 3).map(trade => ({
    id: trade.id,
    date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
    mistake: trade.notes || "No notes provided",
    impact: calculateImpact(trade),
    lesson: `Loss of ₹${((trade.entry_price - (trade.exit_price || 0)) * (trade.quantity || 0)).toFixed(2)}`
  }));

  function calculateImpact(trade: any) {
    if (!trade.exit_price || !trade.quantity) return "Low";
    const loss = (trade.entry_price - trade.exit_price) * trade.quantity;
    if (loss > 1000) return "High";
    if (loss > 500) return "Medium";
    return "Low";
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Trading Mistakes</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Loss Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMistakes.map((mistake) => (
                <TableRow key={mistake.id}>
                  <TableCell>{mistake.date}</TableCell>
                  <TableCell>{mistake.mistake}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      mistake.impact === "High" 
                        ? "bg-destructive/10 text-destructive"
                        : mistake.impact === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {mistake.impact}
                    </span>
                  </TableCell>
                  <TableCell>{mistake.lesson}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Pattern Recognition</h3>
          <div className="space-y-4">
            {patterns.map((item) => (
              <div
                key={item.pattern}
                className="p-4 bg-muted rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.pattern}</span>
                  <span
                    className={`text-sm ${
                      item.frequency > 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.frequency} Occurrences
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Trading Rules</h3>
          <div className="space-y-4">
            {[
              "Never risk more than 1% per trade",
              "Always use stop loss orders",
              "No trading during first 15 minutes",
              "Follow your trading plan",
              "Document every trade with detailed notes",
              "Maximum 2 trades per day",
              "No revenge trading",
              "No averaging down on losses",
            ].map((rule, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-muted rounded-lg"
              >
                <span className="mr-2 font-mono text-sm">{index + 1}.</span>
                {rule}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
