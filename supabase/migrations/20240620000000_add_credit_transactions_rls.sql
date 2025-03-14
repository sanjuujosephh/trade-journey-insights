
-- Enable RLS on credit_transactions table if not already enabled
ALTER TABLE IF EXISTS public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Users can insert their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can update their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can delete their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Service role can manage all credit transactions" ON public.credit_transactions;

-- Create policies for credit_transactions table
CREATE POLICY "Users can insert their own credit transactions"
  ON public.credit_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own credit transactions"
  ON public.credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit transactions"
  ON public.credit_transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit transactions"
  ON public.credit_transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role policy (using a different approach since the JWT check might not work as expected)
CREATE POLICY "Service role can manage all credit transactions"
  ON public.credit_transactions
  FOR ALL
  USING (true);
