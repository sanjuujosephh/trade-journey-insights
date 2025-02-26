
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface StrategyCardProps {
  title: string;
  description: string;
}

export function StrategyCard({ title, description }: StrategyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold">{title}</h4>
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

