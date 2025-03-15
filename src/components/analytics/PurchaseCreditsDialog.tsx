
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUserCredits } from "@/hooks/useUserCredits";
import { toast } from "@/hooks/use-toast";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseCreditsDialog({ 
  open, 
  onOpenChange
}: PurchaseCreditsDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { purchaseCredits, refetch } = useUserCredits();
  
  const handlePurchase = async () => {
    if (!selectedAmount) return;
    
    setIsSubmitting(true);
    
    try {
      await purchaseCredits(selectedAmount);
      
      toast({
        title: "Credits purchased",
        description: `Successfully added ${selectedAmount} credits to your account.`,
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Force refetch credits to update display
      refetch();
      
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "Failed to purchase credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Analysis Credits</DialogTitle>
          <DialogDescription>
            Add more credits to your account for AI-powered trade analysis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={selectedAmount.toString()}
            onValueChange={(value) => setSelectedAmount(parseInt(value))}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="20" id="credits-20" />
              <Label htmlFor="credits-20" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-semibold">20 Credits</div>
                  <div className="text-muted-foreground">₹199</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent relative overflow-hidden">
              <RadioGroupItem value="50" id="credits-50" />
              <Label htmlFor="credits-50" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-semibold">50 Credits</div>
                  <div className="text-muted-foreground">₹399</div>
                </div>
              </Label>
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1 py-0.5 rotate-45 translate-x-2 -translate-y-1">
                Popular
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="100" id="credits-100" />
              <Label htmlFor="credits-100" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-semibold">100 Credits</div>
                  <div className="text-muted-foreground">₹699</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handlePurchase} 
            disabled={isSubmitting || !selectedAmount}
            className="w-full"
          >
            {isSubmitting ? "Processing..." : `Purchase ${selectedAmount} Credits`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
