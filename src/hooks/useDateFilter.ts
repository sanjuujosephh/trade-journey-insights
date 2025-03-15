
import { useState } from "react";
import { Trade } from "@/types/trade";
import { isValid } from "date-fns";
import { useToast } from "./use-toast";

export function useDateFilter(trades: Trade[]) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filter trades based on selected date or show recent 10
  const filteredTrades = selectedDate && isValid(selectedDate) 
    ? trades.filter(trade => {
        // Convert DD-MM-YYYY to Date object for comparison
        if (!trade.entry_date) return false;
        const [day, month, year] = trade.entry_date.split('-').map(Number);
        const tradeDate = new Date(year, month - 1, day);
        return tradeDate.toDateString() === selectedDate.toDateString();
      }) 
    : trades.slice(0, 10); // Show 10 most recent trades if no date selected

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    toast({
      title: "Filter Cleared",
      description: "Showing 10 most recent trades"
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    filteredTrades,
    clearDateFilter
  };
}
