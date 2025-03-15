
import { useState } from "react";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { useUserCredits } from "@/hooks/useUserCredits";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseComplete?: () => void;
}

const CREDIT_PACKAGES = [
  { id: 'basic', credits: 100, price: 99 },
  { id: 'popular', credits: 500, price: 399, popular: true },
  { id: 'max', credits: 1000, price: 699 },
];

export function PurchaseCreditsDialog({ 
  open, 
  onOpenChange, 
  onPurchaseComplete 
}: PurchaseCreditsDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { handlePayment, isPaymentConfigured } = usePayment();
  const { purchaseCredits, refetch } = useUserCredits();

  const handlePurchase = async () => {
    if (!isPaymentConfigured) return;
    
    setIsProcessing(true);
    
    try {
      // First handle the payment
      const customDescription = `${selectedPackage.credits} AI Analysis Credits`;
      await handlePayment({
        title: customDescription,
        price: selectedPackage.price
      }, false);
      
      // Then update the credits in the database
      const result = await purchaseCredits.mutateAsync({ amount: selectedPackage.credits });
      
      if (result.success) {
        // Force an immediate refetch to update UI
        await refetch();
        
        // Call onPurchaseComplete callback if provided
        if (onPurchaseComplete) {
          onPurchaseComplete();
        }
      }
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error purchasing credits:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Analysis Credits</DialogTitle>
          <DialogDescription>
            Buy credits to analyze your trades with AI. Purchased credits never expire.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
                ${selectedPackage.id === pkg.id 
                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                  : 'hover:border-muted-foreground'
                }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              {pkg.popular && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium py-0.5 px-2 rounded-full">
                  Best Value
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center 
                  ${selectedPackage.id === pkg.id 
                    ? 'bg-primary text-white' 
                    : 'border border-muted-foreground'
                  }`}
                >
                  {selectedPackage.id === pkg.id && <Check className="w-3 h-3" />}
                </div>
                
                <div>
                  <div className="font-medium">{pkg.credits} Credits</div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.id === 'popular' ? 'Most popular choice' : `₹${(pkg.price / 100).toFixed(2)} per credit`}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold">₹{pkg.price}</div>
                {pkg.id === 'popular' && (
                  <div className="text-xs text-green-600">Save 20%</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isProcessing || !isPaymentConfigured}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Buy {selectedPackage.credits} Credits
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
