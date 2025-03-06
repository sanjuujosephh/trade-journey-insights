
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoldenRupeeProps {
  className?: string;
  size?: number;
}

export function GoldenRupee({ className, size = 16 }: GoldenRupeeProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <div className="w-full h-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
        <IndianRupee 
          size={size} 
          className="text-white" 
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
}
