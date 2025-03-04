
import { useState } from "react";
import { usePayment } from "./hooks/usePayment";
import { PreviewDialog } from "./PreviewDialog";
import { TradingStrategiesSection } from "./sections/TradingStrategiesSection";
import { ProductsSection } from "./sections/ProductsSection";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

export function StrategiesTab() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { handlePayment, isPaymentConfigured, paymentConfigError, isTestMode } = usePayment();
  
  const handleBuy = async (item: any) => {
    if (!isPaymentConfigured) {
      toast.error("Payment system is not available. Please try again later.");
      return;
    }
    
    try {
      await handlePayment(item);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Could not process payment request");
    }
  };
  
  const handleUnlockAll = async () => {
    if (!isPaymentConfigured) {
      toast.error("Payment system is not available. Please try again later.");
      return;
    }
    
    try {
      await handlePayment(null, true);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Could not process payment request");
    }
  };
  
  return (
    <div className="p-6 space-y-8">
      {paymentConfigError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment system is currently unavailable. You can still browse strategies, but purchasing is temporarily disabled.
          </AlertDescription>
        </Alert>
      )}
      
      {isTestMode && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Using test payment mode. Any purchases will create test subscriptions without actual payment processing.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-8">
        <TradingStrategiesSection 
          onUnlockAll={handleUnlockAll} 
        />

        <ProductsSection
          onPreview={(item) => {
            setSelectedItem(item);
            setIsPreviewOpen(true);
          }}
          onBuy={handleBuy}
        />
      </div>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        item={selectedItem}
      />
    </div>
  );
}
