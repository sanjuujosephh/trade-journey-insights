
import { Check } from "lucide-react";

interface PlanFeatureListProps {
  features: string[];
}

export function PlanFeatureList({ features }: PlanFeatureListProps) {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
