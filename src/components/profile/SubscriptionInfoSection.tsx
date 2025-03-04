
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, ExternalLink } from "lucide-react";
import { format } from "date-fns";

type Subscription = {
  status: 'active' | 'canceled' | 'paused' | 'expired';
  current_period_start: string | null;
  current_period_end: string | null;
  payment_id: string | null;
  razorpay_subscription_id: string | null;
  amount: number | null;
  plan_type?: 'monthly' | 'lifetime';
};

interface SubscriptionInfoSectionProps {
  subscription: Subscription | undefined;
}

export function SubscriptionInfoSection({ subscription }: SubscriptionInfoSectionProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const getStatusBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "canceled":
        return "bg-red-50 text-red-700 border border-red-200";
      case "paused":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount / 100); // Convert from paise to rupees
  };

  const supportEmail = "support@tradingresources.com";

  const isLifetime = subscription?.plan_type === 'lifetime';

  return (
    <div className="rounded-lg bg-white p-6 border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Subscription Information
      </h2>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 mb-2">Subscription Status</div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(subscription?.status)}`}>
              {subscription?.status || "No active subscription"}
            </span>
            {isLifetime && subscription?.status === 'active' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                Lifetime
              </span>
            )}
          </div>
        </div>

        {subscription?.payment_id && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Payment ID</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded border overflow-x-auto">
              {subscription.payment_id}
            </div>
          </div>
        )}

        {subscription?.amount && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Subscription Amount</div>
            <div className="font-medium">
              {formatAmount(subscription.amount)}
              {subscription.plan_type === 'monthly' ? ' / month' : ' (one-time)'}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CalendarDays className="h-4 w-4" />
                {isLifetime ? "Access Period" : "Current Period"}
              </div>
              <div className="text-sm">
                {isLifetime ? (
                  <>From {formatDate(subscription?.current_period_start)} (Lifetime)</>
                ) : (
                  <>{formatDate(subscription?.current_period_start)} - {formatDate(subscription?.current_period_end)}</>
                )}
              </div>
            </div>
          </div>
        </div>

        {subscription?.status === "active" ? (
          <div className="space-y-2">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.open("https://dashboard.razorpay.com", "_blank")}
            >
              Manage Subscription
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="text-xs text-center text-gray-500 mt-2">
              For billing inquiries, contact{" "}
              <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">
                {supportEmail}
              </a>
            </div>
          </div>
        ) : (
          <Button 
            variant="default"
            className="w-full mt-4"
            onClick={() => window.location.href = "/pricing"}
          >
            Subscribe Now
          </Button>
        )}
      </div>
    </div>
  );
}
