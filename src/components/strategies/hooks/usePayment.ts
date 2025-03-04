
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    console.log('Loading Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      reject(false);
    };
    document.body.appendChild(script);
  });
};

type SubscriptionData = {
  id: string;
  user_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  payment_id: string;
  amount: number;
};

export function usePayment() {
  const { user } = useAuth();

  const { data: razorpayKey, isError: isKeyError, error: keyError } = useQuery({
    queryKey: ['razorpay-key'],
    queryFn: async () => {
      console.log('Fetching Razorpay key...');
      
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
    },
    retry: 1, // Retry once in case of transient errors
    staleTime: 60 * 60 * 1000, // Cache for 1 hour since this rarely changes
  });

  const { data: subscription } = useQuery({
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

  const createSubscription = async (paymentId: string, amount: number) => {
    if (!user?.id) {
      console.error('Cannot create subscription: No user ID available');
      return;
    }

    console.log('Creating subscription with payment ID:', paymentId, 'Amount:', amount);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: user.id,
        payment_id: paymentId,
        amount: amount,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }])
      .select();

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
    
    console.log('Subscription created successfully:', data);
    return data;
  };

  const handlePayment = async (item: any, isFullPackage = false) => {
    console.log('Payment initiated for:', isFullPackage ? 'Full Package' : item?.title);
    
    if (!user) {
      toast.error("Please login to make a purchase");
      console.error('Payment aborted: User not logged in');
      return;
    }

    try {
      // Check if Razorpay script is already loaded
      if (!(window as any).Razorpay) {
        console.log('Razorpay script not loaded, loading now...');
        await loadRazorpayScript();
      }

      if (!razorpayKey) {
        toast.error("Payment system is not configured. Please try again later.");
        console.error('Payment aborted: Razorpay key not available');
        return;
      }

      const amount = (isFullPackage ? 499 : item?.price || 499) * 100; // Amount in paise
      console.log('Initializing payment with key:', razorpayKey);
      console.log('Payment amount:', amount/100, 'INR');

      const userName = user?.email?.split('@')[0] || "Trader";
      const userEmail = user?.email || "trader@example.com";
      
      console.log('User details for payment:', { name: userName, email: userEmail });
      
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Monthly Subscription - All Trading Strategies" : item?.title ? `Monthly Subscription - ${item.title}` : "Monthly Subscription",
        handler: async function(response: any) {
          console.log('Payment success, payment ID:', response.razorpay_payment_id);
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
          name: userName,
          email: userEmail
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed by user');
            toast.info("Payment canceled.");
          }
        }
      };

      console.log('Creating Razorpay instance with options:', JSON.stringify(options, null, 2));
      const razorpay = new (window as any).Razorpay(options);
      console.log('Opening Razorpay payment modal');
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Could not initialize payment. Please try again later.");
    }
  };

  return { 
    handlePayment, 
    subscription, 
    isPaymentConfigured: !!razorpayKey,
    paymentConfigError: isKeyError ? (keyError as Error).message : null
  };
}
