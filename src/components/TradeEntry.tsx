
import { ErrorBoundary } from "./ErrorBoundary";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { TradeHistory } from "./trade-form/TradeHistory";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImportTrades } from "./trade-form/ImportTrades";
import { TradeFormManager } from "./trade-form/TradeFormManager";
import { useTradeManagement } from "@/hooks/useTradeManagement";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trade } from "@/types/trade";

export default function TradeEntry() {
  const { toast } = useToast();
  const {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useTradeManagement();

  if (isLoading) return <LoadingSpinner />;

  const handleEdit = (trade: Trade) => {
    console.log('Raw trade data:', trade);
    console.log('Raw entry_time:', trade.entry_time);
    console.log('Raw exit_time:', trade.exit_time);

    // Format the entry and exit times correctly
    const entryTime = trade.entry_time ? new Date(trade.entry_time).toISOString().slice(0, 16) : "";
    const exitTime = trade.exit_time ? new Date(trade.exit_time).toISOString().slice(0, 16) : "";

    console.log('Formatted entry_time:', entryTime);
    console.log('Formatted exit_time:', exitTime);

    setFormData({
      ...trade,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      stop_loss: trade.stop_loss?.toString() ?? "",
      strike_price: trade.strike_price?.toString() ?? "",
      vix: trade.vix?.toString() ?? "",
      call_iv: trade.call_iv?.toString() ?? "",
      put_iv: trade.put_iv?.toString() ?? "",
      planned_risk_reward: trade.planned_risk_reward?.toString() ?? "",
      actual_risk_reward: trade.actual_risk_reward?.toString() ?? "",
      planned_target: trade.planned_target?.toString() ?? "",
      slippage: trade.slippage?.toString() ?? "",
      post_exit_price: trade.post_exit_price?.toString() ?? "",
      exit_efficiency: trade.exit_efficiency?.toString() ?? "",
      confidence_level: trade.confidence_level?.toString() ?? "",
      entry_time: entryTime,
      exit_time: exitTime,
    });
    
    console.log('Updated formData:', formData);
    setEditingId(trade.id);
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
            onDelete={async (id) => {
              const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', id);
              
              if (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete trade",
                  variant: "destructive"
                });
                return;
              }
              
              toast({
                title: "Success",
                description: "Trade deleted successfully!"
              });
            }}
            onViewDetails={(trade) => {
              setSelectedTrade(trade);
              setIsDialogOpen(true);
            }}
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

