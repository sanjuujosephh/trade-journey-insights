
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard } from "lucide-react";
import { format } from "date-fns";

type Subscription = {
  status: 'active' | 'canceled' | 'paused' | 'expired';
  current_period_start: string | null;
  current_period_end: string | null;
  razorpay_subscription_id: string | null;
};

interface SubscriptionInfoSectionProps {
  subscription: Subscription | undefined;
}

export function SubscriptionInfoSection({ subscription }: SubscriptionInfoSectionProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
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

  return (
    <div className="rounded-lg bg-white p-6 border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Subscription Information
      </h2>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 mb-2">Subscription Status</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(subscription?.status)}`}>
            {subscription?.status || "No active subscription"}
          </span>
        </div>

        {subscription?.razorpay_subscription_id && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Subscription ID</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
              {subscription.razorpay_subscription_id}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="grid gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CalendarDays className="h-4 w-4" />
                Current Period
              </div>
              <div className="text-sm">
                {formatDate(subscription?.current_period_start)} - {formatDate(subscription?.current_period_end)}
              </div>
            </div>
          </div>
        </div>

        {subscription?.status === "active" && (
          <Button 
            variant="outline"
            className="w-full mt-4"
            onClick={() => window.open("https://dashboard.razorpay.com/subscriptions", "_blank")}
          >
            Manage Subscription
          </Button>
        )}
      </div>
    </div>
  );
}
