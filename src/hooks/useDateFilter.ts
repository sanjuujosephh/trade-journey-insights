
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
      }).sort((a, b) => {
        // Sort by date (newest first) and then by time (newest first)
        if (a.entry_date === b.entry_date) {
          return (b.entry_time || "") > (a.entry_time || "") ? 1 : -1;
        }
        const [dayA, monthA, yearA] = (a.entry_date || "").split('-').map(Number);
        const [dayB, monthB, yearB] = (b.entry_date || "").split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      })
    : trades
        .slice(0, 10) // Show 10 most recent trades if no date selected
        .sort((a, b) => {
          // Sort by date (newest first) and then by time (newest first)
          if (a.entry_date === b.entry_date) {
            return (b.entry_time || "") > (a.entry_time || "") ? 1 : -1;
          }
          const [dayA, monthA, yearA] = (a.entry_date || "").split('-').map(Number);
          const [dayB, monthB, yearB] = (b.entry_date || "").split('-').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB.getTime() - dateA.getTime();
        });

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
