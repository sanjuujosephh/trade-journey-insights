
import { CalendarClock, CreditCard, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserCredits } from "@/hooks/useUserCredits";
import { format } from "date-fns";
import { GoldenRupee } from "@/components/ui/golden-rupee";

interface CreditsDisplayProps {
  credits: UserCredits | null;
  isLoading: boolean;
  onPurchaseClick: () => void;
}

export function CreditsDisplay({ credits, isLoading, onPurchaseClick }: CreditsDisplayProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 h-12 rounded-md w-full"></div>
    );
  }

  if (!credits) {
    return null;
  }

  const totalCredits = (credits.subscription_credits || 0) + (credits.purchased_credits || 0);
  const nextResetDate = credits.next_reset_date 
    ? format(new Date(credits.next_reset_date), "dd MMM yyyy")
    : 'No reset scheduled';

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-background p-4 rounded-lg border">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Your Analysis Credits</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Credits are used when you analyze trades. You get 100 credits with your subscription which reset on renewal. Purchased credits never expire.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">{totalCredits}</span>
            <span className="text-sm text-muted-foreground">credits remaining</span>
          </div>
          
          {credits.subscription_credits > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Resets: {nextResetDate}</span>
            </div>
          )}
        </div>
      </div>
      
      <Button 
        onClick={onPurchaseClick} 
        variant="default" 
        size="sm" 
        className="whitespace-nowrap"
      >
        <GoldenRupee className="mr-1" size={14} />
        <CreditCard className="mr-2 h-4 w-4" />
        Buy Credits
      </Button>
    </div>
  );
}
