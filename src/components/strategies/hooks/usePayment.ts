
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function usePayment() {
  const { data: razorpayKey } = useQuery({
    queryKey: ['razorpay-key'],
    queryFn: async () => {
      const { data: { razorpay_key }, error } = await supabase
        .from('secrets')
        .select('razorpay_key')
        .single();
      
      if (error) throw error;
      return razorpay_key || "rzp_test_fV1qsPBOPvFCLe"; // Fallback to test key
    }
  });

  const handlePayment = async (item: any, isFullPackage = false) => {
    try {
      const options = {
        key: razorpayKey,
        amount: (isFullPackage ? 499 : item.price) * 100,
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Unlock All Trading Strategies" : `Purchase ${item.title}`,
        handler: function(response: any) {
          toast.success("Payment successful! Your purchase is complete.");
        },
        prefill: {
          name: "Trader",
          email: "trader@example.com"
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
