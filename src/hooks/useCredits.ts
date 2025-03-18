
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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

export function useCredits(userId: string | null) {
  return useQuery({
    queryKey: ['user-credits', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }
      
      return data as UserCredits;
    },
    enabled: !!userId,
  });
}
