
export interface UserCredits {
  id: string;
  user_id: string;
  purchased_credits: number;
  total_credits_used: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  transaction_type: 'purchase' | 'deduction' | 'reset' | 'refund' | 'initial';
  created_at: string | null;
}

export interface UseCreditsParams {
  amount: number;
  description: string;
  transaction_type?: 'purchase' | 'deduction' | 'reset' | 'refund' | 'initial';
}

export interface PurchaseCreditsParams {
  amount: number;
}

export interface CreditOperationResult {
  success: boolean;
  message: string;
}
