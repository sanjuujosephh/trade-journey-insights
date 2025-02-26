
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function SubscriptionManager() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscription = async () => {
    try {
      setIsLoading(true);

      // Create subscription via edge function
      const { data, error } = await supabase.functions.invoke("handle-subscription", {
        body: {
          action: "create",
          userId: user?.id,
          plan: "plan_XXXXXXXXXXXX", // Replace with your Razorpay plan ID
        },
      });

      if (error) throw error;

      // Load Razorpay checkout
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your key
        subscription_id: data.subscription_id,
        name: "Your Company Name",
        description: "Premium Subscription",
        handler: function (response: any) {
          toast({
            title: "Success!",
            description: "Your subscription has been activated.",
          });
        },
        prefill: {
          email: user?.email,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke("handle-subscription", {
        body: {
          action: "cancel",
          userId: user?.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSubscription}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>
      <Button
        onClick={handleCancelSubscription}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        Cancel Subscription
      </Button>
    </div>
  );
}
