
import { ProductCard } from "../ProductCard";
import { ProductSection } from "../ProductSection";
import { tradingCharts, tradingPosters } from "../data/mockData";

interface ProductsSectionProps {
  onPreview: (item: any) => void;
  onBuy: (item: any) => void;
}

export function ProductsSection({ onPreview, onBuy }: ProductsSectionProps) {
  return (
    <>
      <ProductSection title="Trading Charts">
        {tradingCharts.map((chart) => (
          <ProductCard
            key={chart.id}
            {...chart}
            onPreview={() => onPreview(chart)}
            onBuy={() => onBuy(chart)}
          />
        ))}
      </ProductSection>

      <ProductSection title="Trading Posters">
        {tradingPosters.map((poster) => (
          <ProductCard
            key={poster.id}
            {...poster}
            onPreview={() => onPreview(poster)}
            onBuy={() => onBuy(poster)}
          />
        ))}
      </ProductSection>
    </>
  );
}
