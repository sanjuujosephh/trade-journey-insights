
import { Trade } from "@/types/trade";
import { Card } from "@/components/ui/card";
import { TradeHistory } from "@/components/trade-form/TradeHistory";

interface FOTradeTableProps {
  trades: Trade[];
}

export function FOTradeTable({ trades }: FOTradeTableProps) {
  return (
    <Card className="p-6">
      <TradeHistory 
        trades={trades} 
        onEdit={() => {}} 
        onDelete={() => {}} 
        onViewDetails={() => {}}
      />
    </Card>
  );
}
