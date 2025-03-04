
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type SubscriptionData = {
  id: string;
  user_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  payment_id: string;
  amount: number;
};

/**
 * Hook to fetch the user's active subscription
 */
export function useSubscriptionData() {
  const { user } = useAuth();

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching subscription for user:', user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      
      if (data) {
        console.log('Active subscription found for user:', user.id);
      } else {
        console.log('No active subscription found for user:', user.id);
      }
      
      return data as SubscriptionData | null;
    },
    enabled: !!user?.id
  });

  return {
    subscription,
    refetchSubscription
  };
}
