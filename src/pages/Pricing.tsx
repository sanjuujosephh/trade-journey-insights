
import { useEffect } from "react";
import { PricingContainer } from "@/components/pricing/PricingContainer";
import { usePayment } from "@/components/strategies/hooks/usePayment";

export default function Pricing() {
  const { paymentConfigError } = usePayment();

  useEffect(() => {
    if (paymentConfigError) {
      console.error("Payment configuration error:", paymentConfigError);
    }
  }, [paymentConfigError]);

  return <PricingContainer />;
}
