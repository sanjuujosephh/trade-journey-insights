
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditTransaction } from "@/hooks/useUserCredits";
import { CreditTransactionItem } from "./CreditTransactionItem";

interface CreditTransactionsPanelProps {
  transactions: CreditTransaction[] | undefined;
}

export function CreditTransactionsPanel({ transactions }: CreditTransactionsPanelProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No transaction history available.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="bg-muted/50 p-3 border-b">
        <h3 className="text-sm font-medium">Recent Credit Transactions</h3>
      </div>
      <ScrollArea className="h-64">
        <div className="divide-y">
          {transactions.map((transaction) => (
            <CreditTransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
