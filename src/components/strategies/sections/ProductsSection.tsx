
import { ProductCard } from "../ProductCard";
import { ProductSection } from "../ProductSection";
import { useProducts } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

interface ProductsSectionProps {
  onPreview: (item: any) => void;
  onBuy: (item: any) => void;
}

export function ProductsSection({ onPreview, onBuy }: ProductsSectionProps) {
  const { charts, posters, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <>
      <ProductSection title="Trading Charts">
        {charts.map((chart) => (
          <ProductCard
            key={chart.id}
            title={chart.title}
            description={chart.description}
            price={chart.price}
            image={chart.image_url}
            onPreview={() => onPreview(chart)}
            onBuy={() => onBuy(chart)}
          />
        ))}
      </ProductSection>

      <ProductSection title="Trading Posters">
        {posters.map((poster) => (
          <ProductCard
            key={poster.id}
            title={poster.title}
            description={poster.description}
            price={poster.price}
            image={poster.image_url}
            onPreview={() => onPreview(poster)}
            onBuy={() => onBuy(poster)}
          />
        ))}
      </ProductSection>
    </>
  );
}
