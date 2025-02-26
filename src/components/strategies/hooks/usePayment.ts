
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
};

export function usePayment() {
  const { user } = useAuth();

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

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching subscription:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user?.id
  });

  const createSubscription = async (paymentId: string, amount: number) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: user.id,
        payment_id: paymentId,
        amount: amount,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }]);

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const handlePayment = async (item: any, isFullPackage = false) => {
    if (!user) {
      toast.error("Please login to make a purchase");
      return;
    }

    try {
      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        await loadRazorpayScript();
      }

      console.log('Initializing payment with key:', razorpayKey);
      const amount = (isFullPackage ? 499 : item?.price || 499) * 100; // Amount in paise
      
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Monthly Subscription - All Trading Strategies" : item?.title ? `Monthly Subscription - ${item.title}` : "Monthly Subscription",
        handler: async function(response: any) {
          console.log('Payment success:', response);
          try {
            await createSubscription(response.razorpay_payment_id, amount);
            toast.success("Subscription activated successfully!");
            // Reload the page to refresh subscription status
            window.location.reload();
          } catch (error) {
            console.error('Error activating subscription:', error);
            toast.error("Payment processed but subscription activation failed. Please contact support.");
          }
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

  return { handlePayment, subscription };
}
