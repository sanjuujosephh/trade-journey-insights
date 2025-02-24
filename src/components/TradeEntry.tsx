
import { ErrorBoundary } from "./ErrorBoundary";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { TradeHistory } from "./trade-form/TradeHistory";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImportTrades } from "./trade-form/ImportTrades";
import { TradeFormManager } from "./trade-form/TradeFormManager";
import { useTradeManagement } from "@/hooks/useTradeManagement";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trade, FormData } from "@/types/trade";

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
    
    const formDataUpdate: FormData = {
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
      entry_time: trade.entry_time ?? "",
      exit_time: trade.exit_time ?? "",
      entry_date: trade.entry_date ?? "",
      exit_date: trade.exit_date ?? "",
      strategy: trade.strategy ?? "",
      trade_type: trade.trade_type,
      symbol: trade.symbol,
      outcome: trade.outcome,
      notes: trade.notes ?? "",
      chart_link: trade.chart_link ?? "",
      vwap_position: trade.vwap_position ?? "",
      ema_position: trade.ema_position ?? "",
      market_condition: trade.market_condition ?? "",
      timeframe: trade.timeframe ?? "",
      trade_direction: trade.trade_direction ?? "",
      exit_reason: trade.exit_reason ?? "",
      entry_emotion: trade.entry_emotion ?? "",
      exit_emotion: trade.exit_emotion ?? "",
      option_type: trade.option_type ?? ""
    };
    
    setFormData(formDataUpdate);
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
