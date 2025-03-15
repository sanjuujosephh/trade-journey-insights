
import { Trade } from "@/types/trade";
import { TradeHistory } from "@/components/trade-form/TradeHistory";
import { useTradeOperations } from "@/hooks/useTradeOperations";
import { TradeDetailsDialog } from "@/components/TradeDetailsDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface FOTradeTableProps {
  trades: Trade[];
}

export function FOTradeTable({ trades }: FOTradeTableProps) {
  const { updateTrade } = useTradeOperations();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleEdit = (trade: Trade) => {
    updateTrade.mutate({ ...trade });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Invalidate the trades query to refresh data
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsDialogOpen(true);
  };

  return (
    <>
      <TradeHistory 
        trades={trades} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        showFilters={true}
      />
      
      {selectedTrade && (
        <TradeDetailsDialog
          trade={selectedTrade}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedTrade(null);
          }}
        />
      )}
    </>
  );
}
