
import { Avatar } from "@/components/ui/avatar";

export function TraderInfo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        <Avatar className="border-2 border-background">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=trader1" alt="Trader 1" />
        </Avatar>
        <Avatar className="border-2 border-background">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=trader2" alt="Trader 2" />
        </Avatar>
        <Avatar className="border-2 border-background">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=trader3" alt="Trader 3" />
        </Avatar>
      </div>
      <div className="text-xs leading-tight">
        <p>Built using inputs from</p>
        <p className="font-medium">45+ Intraday traders</p>
      </div>
    </div>
  );
}
