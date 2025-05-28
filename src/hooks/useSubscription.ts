
import { useAuth } from "@/contexts/AuthContext";

export function useSubscription() {
  const { user } = useAuth();

  // Since the platform is free, everyone is considered "subscribed"
  return {
    subscription: null,
    isLoading: false,
    isError: false,
    error: null,
    isSubscribed: !!user, // User is "subscribed" if they're logged in
    isTrial: false,
    refetchSubscription: () => Promise.resolve()
  };
}
