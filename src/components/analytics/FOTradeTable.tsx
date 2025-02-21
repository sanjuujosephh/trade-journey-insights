
import { Trade } from "@/types/trade";
import { TradeHistory } from "@/components/trade-form/TradeHistory";

interface FOTradeTableProps {
  trades: Trade[];
}

export function FOTradeTable({ trades }: FOTradeTableProps) {
  return (
    <TradeHistory 
      trades={trades} 
      onEdit={() => {}} 
      onDelete={() => {}} 
      onViewDetails={() => {}}
    />
  );
}
