
-- Create enum for trial request status
CREATE TYPE trial_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create a table to store trial requests
CREATE TABLE IF NOT EXISTS public.trial_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  twitter_followed BOOLEAN DEFAULT false,
  status trial_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(email)
);

-- Enable RLS on the trial_requests table
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own trial requests
CREATE POLICY "Users can insert their own trial requests" 
  ON public.trial_requests 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Allow users to view their own trial requests
CREATE POLICY "Users can view their own trial requests" 
  ON public.trial_requests 
  FOR SELECT 
  TO authenticated 
  USING (
    auth.uid() = user_id
  );

-- Require user_id by adding constraint
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS plan_type TEXT;
