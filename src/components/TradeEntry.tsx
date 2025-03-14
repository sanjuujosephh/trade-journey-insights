
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export default function TradeEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchDate, setSearchDate] = useState("");
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

  // Filter trades to only show 10 most recent trades
  // If search date is provided, filter by that date
  const filteredTrades = searchDate
    ? trades.filter(trade => trade.entry_date === searchDate)
    : trades.slice(0, 10);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering happens automatically via the filteredTrades variable
    toast({
      title: searchDate ? "Filtered Results" : "Showing Recent Trades",
      description: searchDate ? `Showing trades for ${searchDate}` : "Showing 10 most recent trades"
    });
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
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search by date (DD-MM-YYYY)"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" size="sm" variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {searchDate && (
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSearchDate("")}
                >
                  Clear
                </Button>
              )}
            </form>
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {searchDate 
                  ? `Trades for ${searchDate}` 
                  : "Recent Trades (Last 10)"}
              </h3>
              
              {filteredTrades.length === 10 && !searchDate && (
                <Button 
                  variant="link" 
                  className="text-sm" 
                  onClick={() => {
                    // Direct user to the history tab
                    const historyTab = document.querySelector('[value="history"]');
                    if (historyTab instanceof HTMLElement) {
                      historyTab.click();
                    }
                  }}
                >
                  View All Trades
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <TradeHistory
              trades={filteredTrades}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              showEditButton={true}
            />
          </div>
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
