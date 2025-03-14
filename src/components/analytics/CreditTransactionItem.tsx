
import { CreditTransaction } from "@/hooks/useUserCredits";
import { format } from "date-fns";

interface CreditTransactionItemProps {
  transaction: CreditTransaction;
}

export function CreditTransactionItem({ transaction }: CreditTransactionItemProps) {
  return (
    <div className="p-3 flex justify-between items-center">
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
