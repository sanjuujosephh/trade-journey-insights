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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
export default function TradeEntry() {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
    handleViewDetails
  } = useTradeManagement();
  if (isLoading) return <LoadingSpinner />;

  // Filter trades based on selected date or show recent 10
  const filteredTrades = selectedDate && isValid(selectedDate) ? trades.filter(trade => {
    // Convert DD-MM-YYYY to Date object for comparison
    if (!trade.entry_date) return false;
    const [day, month, year] = trade.entry_date.split('-').map(Number);
    const tradeDate = new Date(year, month - 1, day);
    return tradeDate.toDateString() === selectedDate.toDateString();
  }) : trades.slice(0, 10); // Show 10 most recent trades if no date selected

  const handleDelete = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from('trades').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }

      // Invalidate the trades query to refresh data
      queryClient.invalidateQueries({
        queryKey: ['trades']
      });
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
  const clearDateFilter = () => {
    setSelectedDate(undefined);
    toast({
      title: "Filter Cleared",
      description: "Showing 10 most recent trades"
    });
  };
  return <ErrorBoundary>
      <div className="space-y-6 animate-fade-in h-full overflow-y-auto scrollbar-none pb-6">
        <TradeFormManager formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} onSubmit={handleSubmit} editingId={editingId} />

        {trades.length > 0 && <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>

              {selectedDate && <Button type="button" size="sm" variant="outline" onClick={clearDateFilter}>
                  Clear
                </Button>}
            </div>
            
            

            <TradeHistory trades={filteredTrades} onEdit={handleEdit} onDelete={handleDelete} onViewDetails={handleViewDetails} showEditButton={true} />
          </div>}

        <ImportTrades />

        {selectedTrade && <TradeDetailsDialog trade={selectedTrade} open={isDialogOpen} onOpenChange={open => {
        setIsDialogOpen(open);
        if (!open) setSelectedTrade(null);
      }} />}
      </div>
    </ErrorBoundary>;
}