
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
        <div className="flex justify-between items-center">
          <p className="font-semibold">₹{price}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={onBuy}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
