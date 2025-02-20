
import { ReactNode } from "react";

interface TradeDetailSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function TradeDetailSection({ title, children, className = "" }: TradeDetailSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-2 mt-2">
        {children}
      </div>
    </div>
  );
}

export function TradeDetailItem({ label, value, className = "" }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <p>{value}</p>
    </div>
  );
}
