
import { RefreshCw } from "lucide-react";
import { UserCredits } from "@/hooks/useUserCredits";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditsDisplayProps {
  credits: UserCredits | null;
  onBuyCredits: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function CreditsDisplay({ 
  credits, 
  onBuyCredits,
  onRefresh,
  isRefreshing 
}: CreditsDisplayProps) {
  // Calculate total available credits
  const totalCredits = credits ? 
    (credits.subscription_credits || 0) + (credits.purchased_credits || 0) : 0;
  
  // Format next reset date if available
  const resetMessage = credits?.next_reset_date 
    ? `Next reset: ${new Date(credits.next_reset_date).toLocaleDateString()}`
    : "No reset scheduled";

  return (
    <div className="flex items-center justify-between bg-background border rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <h3 className="font-medium">Your Analysis Credits</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex items-center justify-center rounded-full h-5 w-5 border text-xs cursor-help">?</div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>Credits are used when you run AI analyses. Each analysis costs 1 credit.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{totalCredits}</span>
            <span className="text-muted-foreground">credits remaining</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{resetMessage}</span>
          </div>
        </div>
        
        <Button onClick={onBuyCredits} className="whitespace-nowrap">
          Buy Credits
        </Button>
      </div>
    </div>
  );
}
