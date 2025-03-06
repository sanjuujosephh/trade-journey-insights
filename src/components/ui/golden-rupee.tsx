
import { IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoldenRupeeProps {
  className?: string;
  size?: number;
}

export function GoldenRupee({ className, size = 16 }: GoldenRupeeProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <IndianRupee 
        size={size} 
        className="text-amber-500" 
        style={{ 
          color: "#F59E0B", 
          fill: "none"
        }}
      />
    </div>
  );
}
