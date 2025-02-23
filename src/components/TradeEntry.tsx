
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
    // Format the entry and exit times correctly
    const entryTime = trade.entry_time ? new Date(trade.entry_time).toISOString().slice(0, 16) : "";
    const exitTime = trade.exit_time ? new Date(trade.exit_time).toISOString().slice(0, 16) : "";

    setFormData({
      ...formData,
      symbol: trade.symbol,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      trade_type: trade.trade_type,
      stop_loss: trade.stop_loss?.toString() ?? "",
      strategy: trade.strategy ?? "",
      outcome: trade.outcome,
      notes: trade.notes ?? "",
      entry_time: entryTime,
      exit_time: exitTime,
      chart_link: trade.chart_link ?? "",
      vix: trade.vix?.toString() ?? "",
      call_iv: trade.call_iv?.toString() ?? "",
      put_iv: trade.put_iv?.toString() ?? "",
      strike_price: trade.strike_price?.toString() ?? "",
      option_type: trade.option_type ?? "",
      vwap_position: trade.vwap_position ?? "",
      ema_position: trade.ema_position ?? "",
      market_condition: trade.market_condition ?? "",
      timeframe: trade.timeframe ?? "",
      trade_direction: trade.trade_direction ?? "",
      planned_risk_reward: trade.planned_risk_reward?.toString() ?? "",
      actual_risk_reward: trade.actual_risk_reward?.toString() ?? "",
      planned_target: trade.planned_target?.toString() ?? "",
      exit_reason: trade.exit_reason ?? "",
      slippage: trade.slippage?.toString() ?? "",
      post_exit_price: trade.post_exit_price?.toString() ?? "",
      exit_efficiency: trade.exit_efficiency?.toString() ?? "",
      confidence_level: trade.confidence_level?.toString() ?? "",
      entry_emotion: trade.entry_emotion ?? "",
      exit_emotion: trade.exit_emotion ?? "",
    });
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
