
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trade } from "@/types/trade";
import { TradeChart } from "./trade-details/TradeChart";
import { EntryExitDetails } from "./trade-details/EntryExitDetails";
import { TradeContext } from "./trade-details/TradeContext";
import { RiskManagement } from "./trade-details/RiskManagement";
import { PerformanceMetrics } from "./trade-details/PerformanceMetrics";
import { BehavioralAnalysis } from "./trade-details/BehavioralAnalysis";

interface TradeDetailsDialogProps {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TradeDetailsDialog({ trade, open, onOpenChange }: TradeDetailsDialogProps) {
  if (!trade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Trade Details - {trade.symbol}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            <TradeChart chartLink={trade.chart_link} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EntryExitDetails trade={trade} />
              <TradeContext trade={trade} />
              <RiskManagement trade={trade} />
              <PerformanceMetrics trade={trade} />
              <BehavioralAnalysis trade={trade} />

              {/* AI Feedback */}
              {trade.ai_feedback && (
                <div className="col-span-full bg-card p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-4">AI Feedback</h4>
                  <p className="text-sm whitespace-pre-wrap">{trade.ai_feedback}</p>
                </div>
              )}

              {/* Notes */}
              {trade.notes && (
                <div className="col-span-full bg-card p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-4">Notes</h4>
                  <p className="text-sm whitespace-pre-wrap">{trade.notes}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
