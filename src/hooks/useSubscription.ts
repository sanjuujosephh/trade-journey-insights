// This hook is deprecated since the platform is now free
// Keeping it for backward compatibility but returning free access

export function useSubscription() {
  return {
    hasActiveSubscription: true, // Always true since platform is free
    isLoading: false,
    subscription: null,
    trial: null,
    canRequestTrial: false, // No trials needed since it's free
    refetch: () => Promise.resolve()
  };
}
