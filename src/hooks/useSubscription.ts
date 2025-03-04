
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function useSubscription() {
  const { user } = useAuth();

  const { 
    data: subscription, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching subscription status for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription:', error);
          throw error;
        }

        // Check if subscription is expired (end_date is in the past)
        if (data && data.current_period_end) {
          const endDate = new Date(data.current_period_end);
          if (endDate < new Date()) {
            console.log('Subscription expired on:', endDate);
            return { ...data, status: 'expired' };
          }
        }

        return data;
      } catch (err) {
        console.error('Subscription fetch error:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 60 * 1000, // Refetch every hour to check subscription status
  });

  const isSubscribed = !!subscription && 
    subscription.status === 'active' && 
    new Date(subscription.current_period_end) > new Date();

  return {
    subscription,
    isLoading,
    isError,
    error,
    isSubscribed,
    refetchSubscription: refetch
  };
}
