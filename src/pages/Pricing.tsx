
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handlePayment, subscription, isPaymentConfigured, paymentConfigError, isTestMode } = usePayment();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paymentConfigError) {
      console.error("Payment configuration error:", paymentConfigError);
    }
  }, [paymentConfigError]);

  const handleSubscribe = async (planType: 'monthly' | 'lifetime') => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    if (!isPaymentConfigured) {
      toast.error("Payment system is not configured properly");
      return;
    }

    setIsLoading(true);
    
    try {
      // Initialize payment with the selected plan type
      await handlePayment(null, true, planType);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Could not process subscription request");
    } finally {
      setIsLoading(false);
    }
  };

  // If user already has an active subscription, show different content
  if (subscription) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            You're already subscribed!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            You have access to all premium features
          </p>
          <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg text-green-800">
            <p className="font-medium">Subscription details:</p>
            <p className="text-sm">Active until: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
            <p className="text-sm">Payment ID: {subscription.payment_id}</p>
            <p className="text-sm">Plan type: {subscription.plan_type || "monthly"}</p>
            {subscription.amount && (
              <p className="text-sm">Amount: ₹{subscription.amount / 100}</p>
            )}
          </div>
          <Button onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start your trading journey with our premium features
        </p>
        
        {paymentConfigError && (
          <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {paymentConfigError}
            </AlertDescription>
          </Alert>
        )}
        
        {isTestMode && (
          <Alert className="mb-6 max-w-md mx-auto bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Using test payment mode. Subscriptions will be created without actual payment processing.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Monthly Subscription Card */}
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold">Monthly Subscription</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold">₹199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Unlimited Trade Entries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>AI-Powered Trade Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Behaviour Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Custom Feature Requests</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              size="lg" 
              onClick={() => handleSubscribe('monthly')}
              disabled={isLoading || !isPaymentConfigured}
            >
              {isLoading ? "Processing..." : isTestMode ? "Subscribe (Test Mode)" : "Subscribe Now"}
            </Button>
          </CardFooter>
        </Card>

        {/* Lifetime Subscription Card */}
        <Card className="border rounded-lg shadow-sm border-primary/20 bg-primary/5 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Best Value
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold">Lifetime Access</CardTitle>
            <div className="mt-2">
              <span className="text-4xl font-bold">₹2499</span>
              <span className="text-muted-foreground"> one-time</span>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Never Pay Again</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Future Feature Updates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Access To Trading Strategies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Access To JOT Indicator Suite</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Access To Trading Templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Priority Feature Requests</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              size="lg" 
              onClick={() => handleSubscribe('lifetime')}
              disabled={isLoading || !isPaymentConfigured}
              variant="default"
            >
              {isLoading ? "Processing..." : isTestMode ? "Get Lifetime Access (Test)" : "Get Lifetime Access"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {!user && (
        <p className="text-sm text-center mt-8 text-muted-foreground">
          Please <a href="/auth" className="text-primary hover:underline">login</a> to subscribe
        </p>
      )}
    </div>
  );
}
