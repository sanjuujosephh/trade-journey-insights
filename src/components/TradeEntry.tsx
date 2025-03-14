
import { ErrorBoundary } from "./ErrorBoundary";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { TradeHistory } from "./trade-form/TradeHistory";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImportTrades } from "./trade-form/ImportTrades";
import { TradeFormManager } from "./trade-form/TradeFormManager";
import { useTradeManagement } from "@/hooks/useTradeManagement";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function TradeEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleEdit,
    handleViewDetails,
  } = useTradeManagement();

  if (isLoading) return <LoadingSpinner />;

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Invalidate the trades query to refresh data
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in h-full overflow-y-auto scrollbar-none pb-6">
        <TradeFormManager
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          onSubmit={handleSubmit}
          editingId={editingId}
        />

        {trades.length > 0 && (
          <TradeHistory
            trades={trades}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            showEditButton={true}
          />
        )}

        <ImportTrades />

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
      </div>
    </ErrorBoundary>
  );
}
