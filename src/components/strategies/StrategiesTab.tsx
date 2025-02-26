
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Store, Eye } from "lucide-react";

const tradingStrategies = [
  {
    id: 1,
    title: "Price Action Strategy",
    description: "Master the art of reading price action and market structure",
    price: 4999,
    image: "/Trading Chart"
  },
  {
    id: 2,
    title: "Options Trading Strategy",
    description: "Learn advanced options trading strategies for consistent profits",
    price: 4999,
    image: "/Trading Chart"
  },
  {
    id: 3,
    title: "Momentum Trading Strategy",
    description: "Capitalize on market momentum with proven strategies",
    price: 4999,
    image: "/Trading Chart"
  },
  {
    id: 4,
    title: "Breakout Trading Strategy",
    description: "Identify and trade breakout patterns effectively",
    price: 4999,
    image: "/Trading Chart"
  },
  {
    id: 5,
    title: "Swing Trading Strategy",
    description: "Master the art of swing trading for better returns",
    price: 4999,
    image: "/Trading Chart"
  },
  {
    id: 6,
    title: "Gap Trading Strategy",
    description: "Learn to trade gaps for profitable opportunities",
    price: 4999,
    image: "/Trading Chart"
  }
];

const tradingCharts = [
  {
    id: 1,
    title: "Candlestick Patterns Guide",
    description: "Complete guide to candlestick patterns for price action trading",
    price: 1499,
    image: "/Trading Chart"
  },
  {
    id: 2,
    title: "Chart Pattern Analysis",
    description: "Advanced chart patterns for technical analysis",
    price: 1499,
    image: "/Trading Chart"
  },
  {
    id: 3,
    title: "Trading Entry & Exit Guide",
    description: "Chart patterns with entry, exit and stop loss levels",
    price: 1499,
    image: "/Trading Chart"
  }
];

const tradingPosters = [
  {
    id: 4,
    title: "Bull vs Bear Market",
    description: "Artistic visualization of market psychology",
    price: 999,
    image: "/Trading Poster"
  },
  {
    id: 5,
    title: "Trading Psychology",
    description: "Wall Street wisdom in artistic form",
    price: 999,
    image: "/Trading Poster"
  },
  {
    id: 6,
    title: "Market Wolf",
    description: "Inspiring trading motivation poster",
    price: 999,
    image: "/Trading Poster"
  }
];

export function StrategiesTab() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePayment = async (item: any) => {
    try {
      const options = {
        key: "rzp_test_fV1qsPBOPvFCLe",
        amount: item.price * 100, // Amount in paise
        currency: "INR",
        name: "Trading Resources",
        description: `Purchase ${item.title}`,
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

  const renderProductGrid = (products: any[], title: string) => (
    <section>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-[4/3] relative">
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
        {renderProductGrid(tradingStrategies, "Trading Strategies")}
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
