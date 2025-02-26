
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Store, Eye, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
        key: "rzp_test_fV1qsPBOPvFCLe",
        amount: (isFullPackage ? 4999 : item.price) * 100, // Amount in paise
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

  const handlePreview = (item: any) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
  };

  const renderStrategiesSection = () => (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Trading Strategies</h3>
        <Button onClick={() => handlePayment(null, true)} size="lg">
          Unlock All Strategies (₹4999)
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tradingStrategies.map((strategy) => (
          <Card key={strategy.id} className="overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">{strategy.title}</h4>
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderProductGrid = (products: any[], title: string) => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={product.image} 
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold">{product.title}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">₹{product.price}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreview(product)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => handlePayment(product)}>
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <Store className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Trading Resources Shop</h2>
      </div>

      <div className="space-y-8">
        {renderStrategiesSection()}
        {renderProductGrid(tradingCharts, "Trading Charts")}
        {renderProductGrid(tradingPosters, "Trading Posters")}
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full rounded-lg"
              />
              <p className="mt-4 text-muted-foreground">{selectedItem.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
