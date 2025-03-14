
import { Button } from "@/components/ui/button";
import { SaveIcon, Loader2 } from "lucide-react";

interface TradeFormActionsProps {
  isEditing: boolean;
  isSubmitting?: boolean;
}

export function TradeFormActions({ isEditing, isSubmitting = false }: TradeFormActionsProps) {
  return (
    <div className="flex justify-center space-x-2">
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-[120%] text-center" // Increased width by 20%
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Saving..."}
          </>
        ) : (
          <>
            {isEditing ? (
              <SaveIcon className="mr-2 h-4 w-4" />
            ) : (
              <>{isEditing ? "Update Trade" : "Log New Entry"}</>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
