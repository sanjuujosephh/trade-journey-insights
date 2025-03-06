
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditTransaction } from "@/hooks/useUserCredits";
import { format } from "date-fns";

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
            <div key={transaction.id} className="p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  {transaction.description || getDefaultDescription(transaction)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.created_at), "dd MMM yyyy, HH:mm")}
                </p>
              </div>
              <div className={`text-sm font-medium ${getAmountColor(transaction.amount)}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function getDefaultDescription(transaction: CreditTransaction): string {
  switch (transaction.transaction_type) {
    case 'deduction':
      return 'Used credits for analysis';
    case 'purchase':
      return `Purchased ${transaction.amount} credits`;
    case 'reset':
      return 'Credits reset with subscription';
    default:
      return 'Credit transaction';
  }
}

function getAmountColor(amount: number): string {
  if (amount > 0) return 'text-green-600';
  if (amount < 0) return 'text-red-600';
  return '';
}
