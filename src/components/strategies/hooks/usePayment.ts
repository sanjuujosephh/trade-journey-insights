
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

export function usePayment() {
  const { user } = useAuth();
  const { refetchSubscription } = useSubscription();

  const { data: razorpayKey } = useQuery({
    queryKey: ['razorpay-key'],
    queryFn: async () => {
      const { data: { razorpay_key }, error } = await supabase
        .from('secrets')
        .select('razorpay_key')
        .single();
      
      if (error) {
        console.error('Error fetching Razorpay key:', error);
        throw error;
      }
      return razorpay_key || "rzp_test_fV1qsPBOPvFCLe"; // Fallback to test key
    }
  });

  const createSubscription = async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: 'premium',
          status: 'active',
          price: 499,
        });

      if (error) throw error;
      
      await refetchSubscription();
      toast.success("Subscription activated successfully!");
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error("Failed to create subscription");
    }
  };

  const handlePayment = async (item: any, isFullPackage = false) => {
    if (!user) {
      toast.error("Please login to make a purchase");
      return;
    }

    try {
      console.log('Initializing payment with key:', razorpayKey);
      
      const options = {
        key: razorpayKey,
        amount: (isFullPackage ? 499 : item.price) * 100, // Amount in paise
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Unlock All Trading Strategies" : `Purchase ${item.title}`,
        handler: async function(response: any) {
          console.log('Payment success:', response);
          if (isFullPackage) {
            await createSubscription();
          }
          toast.success("Payment successful!");
        },
        prefill: {
          name: user?.email?.split('@')[0] || "Trader",
          email: user?.email || "trader@example.com"
        },
        theme: {
          color: "#6366f1"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return { handlePayment };
}
