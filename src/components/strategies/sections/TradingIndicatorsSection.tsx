
import { StrategyCard } from "../StrategyCard";
import { ProductSection } from "../ProductSection";
import { tradingIndicators } from "../data/mockData";
import { Button } from "@/components/ui/button";
import { GoldenRupee } from "@/components/ui/golden-rupee";

interface TradingIndicatorsSectionProps {
  onUnlockAll: () => void;
}

export function TradingIndicatorsSection({ onUnlockAll }: TradingIndicatorsSectionProps) {
  return (
    <ProductSection title="Trading Indicators" columns={3}>
      <div className="col-span-full flex justify-between items-center mb-4">
        <div className="flex-grow max-w-2xl">
          <p className="text-muted-foreground">
            Premium indicators designed to give you an edge in the markets. 
            These custom-built tools help identify high-probability setups and market conditions.
          </p>
        </div>
        <Button onClick={onUnlockAll} size="lg">
          <GoldenRupee className="mr-1.5" size={18} />
          Unlock All Strategies & Indicators (₹1499)
        </Button>
      </div>
      {tradingIndicators.map((indicator) => (
        <StrategyCard
          key={indicator.id}
          title={indicator.title}
          description={indicator.description}
        />
      ))}
    </ProductSection>
  );
}
