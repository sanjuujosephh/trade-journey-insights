
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoldenRupee } from "@/components/ui/golden-rupee";

interface PreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    title: string;
    description: string;
    image: string;
    price: number;
  } | null;
}

export function PreviewDialog({ isOpen, onOpenChange, item }: PreviewDialogProps) {
  if (!item) return null;

  const features = [
    "High-quality digital print",
    "Premium matte finish",
    "Fade-resistant ink technology"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative" style={{ paddingBottom: "150%" }}>
            <img 
              src={item.image} 
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-2xl font-bold text-primary mb-4">₹{item.price}</p>
              <p className="text-muted-foreground mb-6">{item.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Select Size:</h3>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (12" x 18")</SelectItem>
                  <SelectItem value="medium">Medium (18" x 24")</SelectItem>
                  <SelectItem value="large">Large (24" x 36")</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" size="lg">
              <GoldenRupee className="mr-1.5" />
              Buy Now - ₹{item.price}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
