
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Lock } from "lucide-react";

const strategies = [
  {
    id: 1,
    title: "Momentum Scalping Strategy",
    description: "A dynamic short-term trading strategy that capitalizes on intraday price movements. Perfect for day traders seeking quick profits.",
    content: "Detailed momentum scalping strategy content..."
  },
  {
    id: 2,
    title: "Option Chain Analysis",
    description: "Master the art of analyzing option chains for better trade entries and exits. Learn to identify high-probability setups.",
    content: "Detailed option chain analysis strategy content..."
  },
  {
    id: 3,
    title: "Price Action Trading",
    description: "Learn to read price action without indicators. Develop skills to interpret market psychology and price movements.",
    content: "Detailed price action trading strategy content..."
  },
  {
    id: 4,
    title: "Gap Trading Strategy",
    description: "Systematic approach to capitalize on market gaps. Understand pre-market analysis and gap fill probability patterns.",
    content: "Detailed gap trading strategy content..."
  },
  {
    id: 5,
    title: "Volatility Trading",
    description: "Advanced techniques for trading market volatility effectively. Master VIX analysis and volatility-based indicators.",
    content: "Detailed volatility trading strategy content..."
  },
  {
    id: 6,
    title: "Mean Reversion Strategy",
    description: "Capitalize on market overreactions using statistical analysis. Learn to identify and trade mean reversion opportunities.",
    content: "Detailed mean reversion strategy content..."
  }
];

export function StrategiesTab() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<typeof strategies[0] | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handlePayment = async () => {
    try {
      const options = {
        key: "rzp_test_fV1qsPBOPvFCLe",
        amount: 49900, // Amount in paise (499 INR)
        currency: "INR",
        name: "Trading Strategies",
        description: "One-time payment to unlock all strategies",
        handler: function(response: any) {
          setIsUnlocked(true);
          setIsPaymentDialogOpen(false);
          toast.success("Payment successful! Strategies unlocked.");
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

  const handleStrategyClick = (strategy: typeof strategies[0]) => {
    if (!isUnlocked) {
      setIsPaymentDialogOpen(true);
      return;
    }
    setSelectedStrategy(strategy);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trading Strategies</h2>
        {!isUnlocked && (
          <Button onClick={() => setIsPaymentDialogOpen(true)} variant="default">
            Unlock All Strategies (₹499)
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{strategy.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{strategy.description}</p>
            <Button 
              variant={isUnlocked ? "default" : "secondary"}
              className="w-full"
              onClick={() => handleStrategyClick(strategy)}
            >
              {isUnlocked ? "View Strategy" : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Locked
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock All Trading Strategies</DialogTitle>
            <DialogDescription>
              Get lifetime access to all 6 premium trading strategies for a one-time payment of ₹499.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={handlePayment} className="w-full">
              Pay ₹499 to Unlock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selectedStrategy} onOpenChange={() => setSelectedStrategy(null)}>
        <SheetContent side="left" className="w-[90vw] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedStrategy?.title}</SheetTitle>
            <SheetDescription>
              {selectedStrategy?.description}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-sm leading-relaxed">
              {selectedStrategy?.content}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

