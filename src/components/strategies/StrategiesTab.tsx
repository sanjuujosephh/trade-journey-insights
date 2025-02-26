
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { StrategyCard } from "./StrategyCard";
import { ProductCard } from "./ProductCard";
import { ProductSection } from "./ProductSection";
import { PreviewDialog } from "./PreviewDialog";

const tradingStrategies = [
  {
    id: 1,
    title: "Price Action Strategy",
    description: "Master the art of reading price action and market structure",
  },
  {
    id: 2,
    title: "Options Trading Strategy",
    description: "Learn advanced options trading strategies for consistent profits",
  },
  {
    id: 3,
    title: "Momentum Trading Strategy",
    description: "Capitalize on market momentum with proven strategies",
  },
  {
    id: 4,
    title: "Breakout Trading Strategy",
    description: "Identify and trade breakout patterns effectively",
  },
  {
    id: 5,
    title: "Swing Trading Strategy",
    description: "Master the art of swing trading for better returns",
  },
  {
    id: 6,
    title: "Gap Trading Strategy",
    description: "Learn to trade gaps for profitable opportunities",
  }
];

const tradingCharts = [
  {
    id: 1,
    title: "Candlestick Patterns Guide",
    description: "Complete guide to candlestick patterns for price action trading",
    price: 1499,
    image: "/lovable-uploads/c124b1ac-8bfb-4c20-91c4-de2097432052.png"
  },
  {
    id: 2,
    title: "Chart Pattern Analysis",
    description: "Advanced chart patterns for technical analysis",
    price: 1499,
    image: "/lovable-uploads/9971e6c5-df8f-42dc-9f6a-cccb89857d48.png"
  },
  {
    id: 3,
    title: "Trading Entry & Exit Guide",
    description: "Chart patterns with entry, exit and stop loss levels",
    price: 1499,
    image: "/lovable-uploads/954531e8-3059-44c5-b72d-aafd6320d00a.png"
  }
];

const tradingPosters = [
  {
    id: 4,
    title: "Bull vs Bear Market",
    description: "Artistic visualization of market psychology",
    price: 999,
    image: "/lovable-uploads/5c03886a-b47c-4ba1-82a0-96c414ea3924.png"
  },
  {
    id: 5,
    title: "Trading Psychology",
    description: "Wall Street wisdom in artistic form",
    price: 999,
    image: "/lovable-uploads/92bcb093-bb30-4265-ab45-219440548918.png"
  },
  {
    id: 6,
    title: "Market Wolf",
    description: "Inspiring trading motivation poster",
    price: 999,
    image: "/lovable-uploads/f1ac8fc9-0f66-4402-8c08-73201d10e374.png"
  }
];

export function StrategiesTab() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handlePayment = async (item: any, isFullPackage = false) => {
    try {
      const options = {
        key: "rzp_test_fV1qsPBOPvFCLe", // This is a test key
        amount: (isFullPackage ? 499 : item.price) * 100,
        currency: "INR",
        name: "Trading Resources",
        description: isFullPackage ? "Unlock All Trading Strategies" : `Purchase ${item.title}`,
        handler: function(response: any) {
          toast.success("Payment successful! Your purchase is complete.");
        },
        prefill: {
          name: "Trader",
          email: "trader@example.com"
        },
        theme: {
          color: "#6366f1"
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-8">
        <ProductSection title="Trading Strategies">
          <div className="col-span-full flex justify-between items-center mb-4">
            <div className="flex-grow" />
            <Button onClick={() => handlePayment(null, true)} size="lg">
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

        <ProductSection title="Trading Charts">
          {tradingCharts.map((chart) => (
            <ProductCard
              key={chart.id}
              {...chart}
              onPreview={() => {
                setSelectedItem(chart);
                setIsPreviewOpen(true);
              }}
              onBuy={() => handlePayment(chart)}
            />
          ))}
        </ProductSection>

        <ProductSection title="Trading Posters">
          {tradingPosters.map((poster) => (
            <ProductCard
              key={poster.id}
              {...poster}
              onPreview={() => {
                setSelectedItem(poster);
                setIsPreviewOpen(true);
              }}
              onBuy={() => handlePayment(poster)}
            />
          ))}
        </ProductSection>
      </div>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        item={selectedItem}
      />
    </div>
  );
}
