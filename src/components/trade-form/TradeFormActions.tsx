
import { Button } from "@/components/ui/button";

interface TradeFormActionsProps {
  isEditing: boolean;
}

export function TradeFormActions({ isEditing }: TradeFormActionsProps) {
  return (
    <div className="flex justify-center">
      <Button type="submit" className="w-full sm:w-auto text-[14px] px-8 py-4 text-base">
        {isEditing ? "Update Trade" : "Log New Trade"}
      </Button>
    </div>
  );
}
