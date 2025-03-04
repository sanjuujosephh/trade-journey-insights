
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Hook to fetch the Razorpay API key from Supabase
 */
export function useRazorpayKey() {
  const { data: razorpayKey, isError: isKeyError, error: keyError } = useQuery({
    queryKey: ['razorpay-key'],
    queryFn: async () => {
      console.log('Fetching Razorpay key...');
      
      try {
        const { data, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'RAZORPAY_KEY')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching Razorpay key:', error);
          throw error;
        }

        if (!data || !data.value) {
          console.error('Razorpay key not found in secrets table or value is empty');
          throw new Error('Razorpay key not configured');
        }

        console.log('Razorpay key fetched successfully');
        return data.value;
      } catch (err) {
        console.error('Failed to fetch Razorpay key:', err);
        throw err;
      }
    },
    retry: 1, // Retry once in case of transient errors
    staleTime: 60 * 60 * 1000, // Cache for 1 hour since this rarely changes
  });
  
  return {
    razorpayKey,
    isKeyError,
    keyError
  };
}
