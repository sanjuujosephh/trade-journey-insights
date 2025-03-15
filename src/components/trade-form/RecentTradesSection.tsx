
import { Trade } from "@/types/trade";
import { TradeHistory } from "./TradeHistory";
import { DateFilterControls } from "./DateFilterControls";

interface RecentTradesSectionProps {
  trades: Trade[];
  filteredTrades: Trade[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  clearDateFilter: () => void;
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onViewDetails: (trade: Trade) => void;
  navigateToHistoryTab: () => void;
}

export function RecentTradesSection({
  trades,
  filteredTrades,
  selectedDate,
  setSelectedDate,
  clearDateFilter,
  onEdit,
  onDelete,
  onViewDetails,
  navigateToHistoryTab
}: RecentTradesSectionProps) {
  if (trades.length === 0) return null;

  return (
    <div className="space-y-4 mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
      
      <DateFilterControls
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        clearDateFilter={clearDateFilter}
        navigateToHistoryTab={navigateToHistoryTab}
      />
      
      <TradeHistory 
        trades={filteredTrades} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        onViewDetails={onViewDetails} 
        showEditButton={true} 
      />
    </div>
  );
}
