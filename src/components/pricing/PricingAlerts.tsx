
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface PricingAlertsProps {
  paymentConfigError: string | null;
  isTestMode: boolean;
}

export function PricingAlerts({ paymentConfigError, isTestMode }: PricingAlertsProps) {
  return (
    <>
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
    </>
  );
}
