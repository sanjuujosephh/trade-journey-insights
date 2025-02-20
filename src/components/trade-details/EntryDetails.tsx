
import { Trade } from "@/types/trade";
import { TradeDetailSection, TradeDetailItem } from "./TradeDetailSection";

interface EntryDetailsProps {
  trade: Trade;
  formatDateTime: (dateString: string) => string;
}

export function EntryDetails({ trade, formatDateTime }: EntryDetailsProps) {
  return (
    <TradeDetailSection title="Entry Details">
      <TradeDetailItem label="Price" value={`₹${trade.entry_price}`} />
      <TradeDetailItem 
        label="Time" 
        value={trade.entry_time ? formatDateTime(trade.entry_time) : 'N/A'} 
      />
      {trade.strike_price && (
        <TradeDetailItem label="Strike Price" value={`₹${trade.strike_price}`} />
      )}
      {trade.option_type && (
        <TradeDetailItem 
          label="Option Type" 
          value={<span className="capitalize">{trade.option_type}</span>} 
        />
      )}
      {trade.entry_emotion && (
        <TradeDetailItem 
          label="Entry Emotion" 
          value={<span className="capitalize">{trade.entry_emotion}</span>} 
        />
      )}
    </TradeDetailSection>
  );
}
