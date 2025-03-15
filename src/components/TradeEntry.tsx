
import { ErrorBoundary } from "./ErrorBoundary";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { LoadingSpinner } from "./LoadingSpinner";
import { ImportTrades } from "./trade-form/ImportTrades";
import { useTradeManagement } from "@/hooks/useTradeManagement";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useToast } from "@/hooks/use-toast";
import { TradeEntryForm } from "./trade-form/TradeEntryForm";
import { RecentTradesSection } from "./trade-form/RecentTradesSection";
import { useTradeDelete } from "./trade-form/TradeDeleteHandler";

export default function TradeEntry() {
  const { toast } = useToast();
  
  // Trade management hooks
  const {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    isSubmitting,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleEdit,
    handleViewDetails,
    resetForm,
    setEditingId
  } = useTradeManagement();

  // Date filtering
  const {
    selectedDate,
    setSelectedDate,
    filteredTrades,
    clearDateFilter
  } = useDateFilter(trades);

  // Trade deletion
  const { handleDelete } = useTradeDelete({ 
    onEditingCancelled: () => {
      resetForm();
      setEditingId(null);
    },
    editingId
  });

  // Cancel editing
  const cancelEditing = () => {
    resetForm();
    setEditingId(null);
    toast({
      title: "Editing Cancelled",
      description: "Changes have been discarded"
    });
  };

  // Navigate to history tab
  const navigateToHistoryTab = () => {
    const historyTabTrigger = document.querySelector('[value="history"]') as HTMLElement;
    if (historyTabTrigger) {
      historyTabTrigger.click();
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in h-full overflow-y-auto scrollbar-none pb-6">
        {/* Trade Entry Form */}
        <TradeEntryForm
          formData={formData}
          editingId={editingId}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          cancelEditing={cancelEditing}
        />

        {/* Recent Trades Section */}
        {trades.length > 0 && (
          <RecentTradesSection
            trades={trades}
            filteredTrades={filteredTrades}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            clearDateFilter={clearDateFilter}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            navigateToHistoryTab={navigateToHistoryTab}
          />
        )}

        {/* Import/Export Section */}
        <ImportTrades />

        {/* Trade Details Dialog */}
        {selectedTrade && (
          <TradeDetailsDialog 
            trade={selectedTrade} 
            open={isDialogOpen} 
            onOpenChange={open => {
              setIsDialogOpen(open);
              if (!open) setSelectedTrade(null);
            }} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
