
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanFeatureList } from "./PlanFeatureList";

interface PricingPlanCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  onSubscribe: () => void;
  isLoading: boolean;
  isPaymentConfigured: boolean;
  isTestMode: boolean;
  isBestValue?: boolean;
  buttonText?: string;
  planId?: string;
}

export function PricingPlanCard({
  title,
  price,
  period,
  features,
  onSubscribe,
  isLoading,
  isPaymentConfigured,
  isTestMode,
  isBestValue = false,
  buttonText,
  planId,
}: PricingPlanCardProps) {
  // Determine card background style based on planId
  const getCardStyle = () => {
    if (planId === 'monthly') {
      return 'border-green-200 bg-gradient-to-br from-blue-50 to-green-50';
    } else if (planId === 'lifetime') {
      return 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100';
    } else if (isBestValue) {
      return 'border-primary/20 bg-primary/5';
    }
    return '';
  };

  return (
    <Card className={`border rounded-lg shadow-sm ${getCardStyle()} relative overflow-hidden`}>
      {isBestValue && (
        <div className="absolute -top-4 left-6 transform -translate-x-0 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
          Best Value
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <div className="mt-2">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <PlanFeatureList features={features} />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          size="lg" 
          onClick={onSubscribe}
          disabled={isLoading || !isPaymentConfigured}
          variant={isBestValue ? "default" : "default"}
        >
          {isLoading 
            ? "Processing..." 
            : buttonText || (isTestMode 
              ? `Subscribe (Test Mode)` 
              : "Subscribe Now")}
        </Button>
      </CardFooter>
    </Card>
  );
}
