
import { Button } from "@/components/ui/button";

interface TradeFormActionsProps {
  isEditing: boolean;
}

export function TradeFormActions({ isEditing }: TradeFormActionsProps) {
  return (
    <div className="flex justify-center">
      <Button type="submit" className="w-full sm:w-auto text-[14px]">
        {isEditing ? "Update Trade" : "Log New Trade"}
      </Button>
    </div>
  );
}
