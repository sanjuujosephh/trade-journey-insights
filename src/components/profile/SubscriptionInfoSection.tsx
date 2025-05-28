
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export function SubscriptionInfoSection() {
  return (
    <div className="rounded-lg bg-white p-6 border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Crown className="h-5 w-5 text-yellow-500" />
        Account Status
      </h2>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 mb-2">Account Type</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              Free Premium Access
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-center">
            <div className="text-green-600 font-medium mb-2">
              🎉 All Features Unlocked
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You have access to all premium features including unlimited trade entries, 
              advanced analytics, AI-powered analysis, and all trading strategies.
            </p>
            <Button 
              variant="default"
              className="w-full"
              onClick={() => window.location.href = "/"}
            >
              Start Trading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
