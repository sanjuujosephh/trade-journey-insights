
import { CalendarClock, CreditCard, InfoIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserCredits } from "@/hooks/useUserCredits";
import { format } from "date-fns";

interface CreditsDisplayProps {
  credits: UserCredits | null;
  isLoading: boolean;
  onPurchaseClick: () => void;
  onRefresh?: () => void;
}

export function CreditsDisplay({ 
  credits, 
  isLoading, 
  onPurchaseClick, 
  onRefresh 
}: CreditsDisplayProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 h-12 rounded-md w-full"></div>
    );
  }

  // Ensure we handle null credits properly
  const subscriptionCredits = credits?.subscription_credits ?? 0;
  const purchasedCredits = credits?.purchased_credits ?? 0;
  const totalCredits = subscriptionCredits + purchasedCredits;
  
  const nextResetDate = credits?.next_reset_date 
    ? format(new Date(credits.next_reset_date), "dd MMM yyyy")
    : 'No reset scheduled';

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-background p-4 rounded-lg border w-full">
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
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={onRefresh}
              title="Refresh credit balance"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">{totalCredits}</span>
            <span className="text-sm text-muted-foreground">credits remaining</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Subscription: {subscriptionCredits}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Purchased: {purchasedCredits}</span>
            </div>
          </div>
          
          {credits?.subscription_credits > 0 && credits?.next_reset_date && (
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
        <CreditCard className="mr-2 h-4 w-4" />
        Buy Credits
      </Button>
    </div>
  );
}
