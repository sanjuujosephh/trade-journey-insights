
import { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';

export function useDateFilter(trades: Trade[]) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filter trades based on selected date
  const filteredTrades = useMemo(() => {
    // Sort trades by entry date and time (newest first)
    const sortedTrades = [...trades].sort((a, b) => {
      // First compare by entry_date (newest first)
      const dateComparison = (b.entry_date || '').localeCompare(a.entry_date || '');
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, compare by entry_time (newest first)
      return (b.entry_time || '').localeCompare(a.entry_time || '');
    });
    
    // If no date selected, return all trades (sorted)
    if (!selectedDate) return sortedTrades;
    
    // Format the selected date to match entry_date format (DD-MM-YYYY)
    const formattedDate = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    
    // Filter trades by the formatted date
    return sortedTrades.filter(trade => trade.entry_date === formattedDate);
  }, [trades, selectedDate]);

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  return {
    selectedDate,
    setSelectedDate,
    filteredTrades,
    clearDateFilter
  };
}
