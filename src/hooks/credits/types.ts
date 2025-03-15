
export interface UserCredits {
  id: string;
  user_id: string;
  subscription_credits: number;
  purchased_credits: number;
  total_credits_used: number;
  last_reset_date: string | null;
  next_reset_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  transaction_type: 'purchase' | 'deduction' | 'reset' | 'refund';
  created_at: string | null;
}

export interface UseCreditsParams {
  amount: number;
  description: string;
  transaction_type?: 'purchase' | 'deduction' | 'reset' | 'refund';
}

export interface PurchaseCreditsParams {
  amount: number;
}

export interface CreditOperationResult {
  success: boolean;
  message: string;
}
