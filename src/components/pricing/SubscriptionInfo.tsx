
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SubscriptionData } from "../strategies/hooks/paymentUtils/useSubscriptionData";

interface SubscriptionInfoProps {
  subscription: SubscriptionData;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const navigate = useNavigate();

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
