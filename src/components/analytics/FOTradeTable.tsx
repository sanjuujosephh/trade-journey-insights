
import { Trade } from "@/types/trade";
import { TradeHistory } from "@/components/trade-form/TradeHistory";
import { useTradeOperations } from "@/hooks/useTradeOperations";

interface FOTradeTableProps {
  trades: Trade[];
}

export function FOTradeTable({ trades }: FOTradeTableProps) {
  const { updateTrade } = useTradeOperations();
  
  const handleEdit = (trade: Trade) => {
    // This will be handled by the parent component's onEdit prop
    console.log('Editing trade:', trade);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // The real-time subscription will handle the UI update
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const handleViewDetails = (trade: Trade) => {
    // This will be handled by the parent component's onViewDetails prop
    console.log('Viewing trade details:', trade);
  };

  return (
    <TradeHistory 
      trades={trades} 
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={handleViewDetails}
    />
  );
}
