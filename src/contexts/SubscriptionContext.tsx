
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: "active" | "pending" | "cancelled";
  end_date: string;
  price: number;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  refetchSubscription: () => Promise<void>;
  hasActiveSubscription: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log('Fetching subscription for user:', user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw error;
      }

      console.log('Subscription data:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?.id) {
        setHasActiveSubscription(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_active_subscription', {
          user_id: user.id
        });

        if (error) {
          console.error('Error checking subscription:', error);
          toast.error('Failed to verify subscription status');
          return;
        }

        console.log('Active subscription check:', data);
        setHasActiveSubscription(!!data);
      } catch (error) {
        console.error('Error in subscription check:', error);
        setHasActiveSubscription(false);
      }
    };

    checkSubscription();
  }, [user?.id, subscription]);

  const refetchSubscription = async () => {
    await refetch();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      isLoading,
      error: error as Error | null,
      refetchSubscription,
      hasActiveSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
