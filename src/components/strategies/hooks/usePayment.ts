
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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

  const handlePayment = async (item: any, isFullPackage = false) => {
    if (!user) {
      toast.error("Please login to make a purchase");
      return;
    }

    if (!(window as any).Razorpay) {
      console.error('Razorpay SDK not loaded');
      toast.error("Payment system is not ready. Please try again later.");
      return;
    }

    try {
      console.log('Initializing payment with key:', razorpayKey);
      
      const options = {
        key: razorpayKey,
        amount: (isFullPackage ? 499 : item?.price || 499) * 100, // Amount in paise
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Unlock All Trading Strategies" : item?.title ? `Purchase ${item.title}` : "Purchase",
        handler: function(response: any) {
          console.log('Payment success:', response);
          toast.success("Payment successful! Your purchase is complete.");
          // Here you would typically call your backend to verify the payment
          // and grant access to the purchased content
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
