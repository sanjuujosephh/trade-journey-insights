
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { GoldenRupee } from "@/components/ui/golden-rupee";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
  onPreview: () => void;
  onBuy: () => void;
}

export function ProductCard({ 
  title, 
  description, 
  price, 
  image, 
  onPreview, 
  onBuy 
}: ProductCardProps) {
  const originalPrice = Math.round(price * 1.4); // 40% higher original price

  return (
    <Card className="overflow-hidden">
      <div className="relative" style={{ paddingBottom: "150%" }}>
        <img 
          src={image} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-lg">₹{price}</p>
            <p className="text-sm text-muted-foreground line-through">₹{originalPrice}</p>
            <span className="text-sm text-green-600 font-medium">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={onBuy}>
              <GoldenRupee className="mr-1" size={14} />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
