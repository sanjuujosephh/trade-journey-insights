
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
        className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600"
        style={{ fill: "url(#goldGradient)", stroke: "none" }}
      />
      <svg width="0" height="0" className="absolute">
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF7CD" />
          <stop offset="50%" stopColor="#FEC107" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </svg>
    </div>
  );
}
