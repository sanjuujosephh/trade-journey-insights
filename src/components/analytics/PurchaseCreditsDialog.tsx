
import { useState } from "react";
import { Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useUserCredits } from "@/hooks/useUserCredits";
import { toast } from "sonner";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CREDIT_PACKAGES = [
  { id: 'basic', credits: 100 },
  { id: 'popular', credits: 500, popular: true },
  { id: 'max', credits: 1000 },
];

export function PurchaseCreditsDialog({ open, onOpenChange }: PurchaseCreditsDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { purchaseCredits } = useUserCredits();

  const handleGetCredits = async () => {
    setIsProcessing(true);
    
    try {
      // Give credits for free since the platform is now free
      await purchaseCredits.mutateAsync({ amount: selectedPackage.credits });
      
      toast.success(`${selectedPackage.credits} credits added to your account!`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to add credits. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Free Analysis Credits</DialogTitle>
          <DialogDescription>
            Get free credits to analyze your trades with AI. All credits are completely free!
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
                  Most Popular
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
                    {pkg.id === 'popular' ? 'Most popular choice' : 'Free credits for AI analysis'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-green-600">FREE</div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGetCredits} disabled={isProcessing}>
            {isProcessing ? (
              "Adding Credits..."
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Get {selectedPackage.credits} Free Credits
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
