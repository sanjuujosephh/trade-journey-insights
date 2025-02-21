
import { Card } from "@/components/ui/card";
import { Trade } from "@/types/trade";

interface FOTradeTableProps {
  trades: Trade[];
}

export function FOTradeTable({ trades }: FOTradeTableProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">F&O Trade History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Symbol</th>
              <th className="p-2">Type</th>
              <th className="p-2">Entry</th>
              <th className="p-2">Exit</th>
              <th className="p-2">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b">
                <td className="p-2">{trade.symbol}</td>
                <td className="p-2">{trade.trade_type}</td>
                <td className="p-2">{trade.entry_price}</td>
                <td className="p-2">{trade.exit_price || '-'}</td>
                <td className="p-2">{trade.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
