
import { StrategyCard } from "../StrategyCard";
import { ProductSection } from "../ProductSection";
import { tradingIndicators } from "../data/mockData";

interface TradingIndicatorsSectionProps {
  onUnlockAll: () => void;
}

export function TradingIndicatorsSection({ onUnlockAll }: TradingIndicatorsSectionProps) {
  return (
    <ProductSection title="Trading Indicators" columns={3}>
      <div className="col-span-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="flex-grow max-w-2xl">
          <p className="text-muted-foreground">
            Premium indicators designed to give you an edge in the markets. 
            These custom-built tools help identify high-probability setups and market conditions.
          </p>
        </div>
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
