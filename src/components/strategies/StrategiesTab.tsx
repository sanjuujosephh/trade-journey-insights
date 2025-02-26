
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Store, Eye } from "lucide-react";

const tradingCharts = [
  {
    id: 1,
    title: "Candlestick Patterns Guide",
    description: "Complete guide to candlestick patterns for price action trading",
    price: 1499,
    image: "/lovable-uploads/4d1e41fd-61c9-4177-b3e9-ab9fcc924095.png"
  },
  {
    id: 2,
    title: "Chart Pattern Analysis",
    description: "Advanced chart patterns for technical analysis",
    price: 1499,
    image: "/lovable-uploads/b789d466-1a53-4f97-a532-cb7566e9594d.png"
  },
  {
    id: 3,
    title: "Trading Entry & Exit Guide",
    description: "Chart patterns with entry, exit and stop loss levels",
    price: 1499,
    image: "/lovable-uploads/962cf5f2-824a-4a96-98c0-39943e994b68.png"
  }
];

const tradingPosters = [
  {
    id: 4,
    title: "Bull vs Bear Market",
    description: "Artistic visualization of market psychology",
    price: 999,
    image: "/lovable-uploads/c0e5341f-5de0-4c37-ae64-0e7cb273aec2.png"
  },
  {
    id: 5,
    title: "Trading Psychology",
    description: "Wall Street wisdom in artistic form",
    price: 999,
    image: "/lovable-uploads/0ba9828a-f1ce-4d95-9477-ed38dda44998.png"
  },
  {
    id: 6,
    title: "Market Wolf",
    description: "Inspiring trading motivation poster",
    price: 999,
    image: "/lovable-uploads/efeac548-d785-4806-bb14-d51c4f29e5e3.png"
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

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <Store className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Trading Resources Shop</h2>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">Trading Charts</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tradingCharts.map((chart) => (
              <Card key={chart.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={chart.image} 
                    alt={chart.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold">{chart.title}</h4>
                    <p className="text-sm text-muted-foreground">{chart.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">₹{chart.price}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePreview(chart)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => handlePayment(chart)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Trading Posters</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tradingPosters.map((poster) => (
              <Card key={poster.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={poster.image} 
                    alt={poster.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold">{poster.title}</h4>
                    <p className="text-sm text-muted-foreground">{poster.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">₹{poster.price}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePreview(poster)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => handlePayment(poster)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
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
