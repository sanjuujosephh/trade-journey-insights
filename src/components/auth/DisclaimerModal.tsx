
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DISCLAIMER_TEXT = `Onetradejournal by Softscotch Solution Private Limited is not responsible for any profits or losses incurred from trading activities. Investment is inherently subject to market risks. Uncertainty is always a factor, and various risks may overlap and amplify one another, potentially leading to unforeseen impacts on the value of investments. The value of assets and any associated income may rise or fall, and there is the possibility of losing the full amount of your initial investment. Market fluctuations and related changes are just some of the factors that can influence these variations. Historical performance does not guarantee or predict future results.

The information on this Website, including opinions, analysis, suggestions, news, prices, AI suggestions, and other content, is provided for general informational and educational purposes only. It should not be interpreted as investment advice or relied upon in place of thorough, independent research before making any trading decisions. Market conditions, opinions, and recommendations are subject to change without prior notice. Onetradejournal by Softscotch Solution Private Limited is not responsible for any loss or damage, including but not limited to financial losses, resulting from reliance on the information provided.

We strongly advise against using technical analysis as the sole basis for trading decisions or making impulsive trading moves. Always remember that past performance does not guarantee future results.`;

const CURRENT_DISCLAIMER_VERSION = 1;

export function DisclaimerModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkDisclaimerAcceptance = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has already accepted the disclaimer
        const { data, error } = await supabase
          .from("disclaimer_acceptances")
          .select("*")
          .eq("user_id", user.id)
          .eq("disclaimer_version", CURRENT_DISCLAIMER_VERSION)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error code
          console.error("Error checking disclaimer acceptance:", error);
          toast({
            title: "Error",
            description: "Failed to check disclaimer status",
            variant: "destructive",
          });
        }

        // If no acceptance record exists, show the modal
        if (!data) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error in disclaimer check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDisclaimerAcceptance();
  }, [user, toast]);

  const handleAcceptDisclaimer = async () => {
    if (!user || !hasChecked) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("disclaimer_acceptances")
        .insert({
          user_id: user.id,
          disclaimer_version: CURRENT_DISCLAIMER_VERSION,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Disclaimer accepted",
        description: "Thank you for accepting the disclaimer",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error recording disclaimer acceptance:", error);
      toast({
        title: "Error",
        description: "Failed to record your acceptance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if still loading or no user
  if (isLoading || !user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing the modal without accepting
      if (!open) {
        return;
      }
      setIsOpen(open);
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Important Disclaimer</DialogTitle>
          <DialogDescription>
            Please read and accept the following disclaimer to continue using Onetradejournal.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-muted/50 rounded-md text-sm whitespace-pre-line">
          {DISCLAIMER_TEXT}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Checkbox 
            id="accept-disclaimer" 
            checked={hasChecked} 
            onCheckedChange={(checked) => setHasChecked(checked === true)}
          />
          <label htmlFor="accept-disclaimer" className="text-sm font-medium cursor-pointer">
            I have read and agree to the disclaimer
          </label>
        </div>

        <DialogFooter className="mt-4">
          <Button 
            onClick={handleAcceptDisclaimer} 
            disabled={!hasChecked || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Accept & Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
