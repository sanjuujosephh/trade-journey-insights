
import { Button } from "@/components/ui/button";
import { StrategyCard } from "../StrategyCard";
import { ProductSection } from "../ProductSection";
import { tradingStrategies } from "../data/mockData";

interface TradingStrategiesSectionProps {
  onUnlockAll: () => void;
}

export function TradingStrategiesSection({ onUnlockAll }: TradingStrategiesSectionProps) {
  return (
    <ProductSection title="Trading Strategies">
      <div className="col-span-full flex justify-between items-center mb-4">
        <div className="flex-grow max-w-2xl">
          <p className="text-muted-foreground">
            Unlock access to our comprehensive collection of proven trading strategies. 
            Learn advanced techniques for consistent profits in any market condition.
          </p>
        </div>
        <Button onClick={onUnlockAll} size="lg">
          Unlock All Strategies (₹499)
        </Button>
      </div>
      {tradingStrategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          title={strategy.title}
          description={strategy.description}
        />
      ))}
    </ProductSection>
  );
}
