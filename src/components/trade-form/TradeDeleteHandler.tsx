
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TradeDeleteHandlerProps {
  onDelete: (id: string) => void;
  onEditingCancelled: () => void;
  editingId: string | null;
}

export function useTradeDelete({ onEditingCancelled, editingId }: Omit<TradeDeleteHandlerProps, 'onDelete'>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }

      // Clear form if the deleted trade was being edited
      if (editingId === id) {
        onEditingCancelled();
      }

      // Invalidate the trades query to refresh data
      queryClient.invalidateQueries({
        queryKey: ['trades']
      });
      
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleDelete };
}
