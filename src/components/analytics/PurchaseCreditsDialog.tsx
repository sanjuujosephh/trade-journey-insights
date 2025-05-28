
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits?: number;
}

export function PurchaseCreditsDialog({
  open,
  onOpenChange,
  currentCredits = 0
}: PurchaseCreditsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsLoading(false);
    onOpenChange(false);
    toast.success("Great news! The platform is now completely free!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Platform is Now Free!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-green-700">🎉 Exciting News!</CardTitle>
              <CardDescription className="text-green-600">
                Our trading journal platform is now completely free for all users!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-green-700">
                Unlimited AI Analysis
              </div>
              <p className="text-green-600">
                Enjoy unlimited access to all features including AI trade analysis, 
                without any credit limitations.
              </p>
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Current Credits: <span className="font-bold">Unlimited ∞</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              Awesome! Let's Trade
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
