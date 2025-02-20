
import { Trade } from "@/types/trade";
import { formatDateTime } from "@/utils/formatDateTime";

interface EntryExitDetailsProps {
  trade: Trade;
}

export function EntryExitDetails({ trade }: EntryExitDetailsProps) {
  return (
    <>
      {/* Entry Details */}
      <div className="bg-card p-4 rounded-lg border">
        <h4 className="text-sm font-medium mb-4">Entry Details</h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Price:</span>
            <p className="font-medium">₹{trade.entry_price}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Time:</span>
            <p className="font-medium">{trade.entry_time ? formatDateTime(trade.entry_time) : 'N/A'}</p>
          </div>
          {trade.strike_price && (
            <div>
              <span className="text-sm text-muted-foreground">Strike Price:</span>
              <p className="font-medium">₹{trade.strike_price}</p>
            </div>
          )}
          {trade.option_type && (
            <div>
              <span className="text-sm text-muted-foreground">Option Type:</span>
              <p className="font-medium capitalize">{trade.option_type}</p>
            </div>
          )}
          {trade.entry_emotion && (
            <div>
              <span className="text-sm text-muted-foreground">Entry Emotion:</span>
              <p className="font-medium capitalize">{trade.entry_emotion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Exit Details */}
      <div className="bg-card p-4 rounded-lg border">
        <h4 className="text-sm font-medium mb-4">Exit Details</h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Price:</span>
            <p className="font-medium">{trade.exit_price ? `₹${trade.exit_price}` : 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Time:</span>
            <p className="font-medium">{trade.exit_time ? formatDateTime(trade.exit_time) : 'N/A'}</p>
          </div>
          {trade.exit_reason && (
            <div>
              <span className="text-sm text-muted-foreground">Exit Reason:</span>
              <p className="font-medium capitalize">{trade.exit_reason.replace('_', ' ')}</p>
            </div>
          )}
          {trade.exit_emotion && (
            <div>
              <span className="text-sm text-muted-foreground">Exit Emotion:</span>
              <p className="font-medium capitalize">{trade.exit_emotion}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
