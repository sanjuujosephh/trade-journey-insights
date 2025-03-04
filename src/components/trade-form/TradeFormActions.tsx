
import { Button } from "@/components/ui/button";

interface TradeFormActionsProps {
  isEditing: boolean;
}

export function TradeFormActions({ isEditing }: TradeFormActionsProps) {
  return (
    <div className="flex justify-end">
      <Button type="submit" className="w-full sm:w-auto text-[19px]">
        {isEditing ? "Update Trade" : "Log New Trade"}
      </Button>
    </div>
  );
}
