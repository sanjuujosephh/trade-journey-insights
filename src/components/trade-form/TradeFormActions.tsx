
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
        className="text-lg py-6 px-8" // Increased overall button size with padding and font
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Updating..." : "Saving..."}
          </>
        ) : (
          <>
            <SaveIcon className="mr-2 h-4 w-4" />
            {isEditing ? "Update Trade" : "Log New Trade"}
          </>
        )}
      </Button>
    </div>
  );
}
