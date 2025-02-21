
import { Button } from "@/components/ui/button";

interface TradeFormActionsProps {
  isEditing: boolean;
}

export function TradeFormActions({ isEditing }: TradeFormActionsProps) {
  return (
    <div className="flex justify-end">
      <Button type="submit" className="w-full sm:w-auto">
        {isEditing ? "Update Trade" : "Log Trade"}
      </Button>
    </div>
  );
}
