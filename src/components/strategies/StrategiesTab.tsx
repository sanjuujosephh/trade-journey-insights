
import { useState } from "react";
import { usePayment } from "./hooks/usePayment";
import { PreviewDialog } from "./PreviewDialog";
import { TradingStrategiesSection } from "./sections/TradingStrategiesSection";
import { ProductsSection } from "./sections/ProductsSection";

export function StrategiesTab() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { handlePayment } = usePayment();
  
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-8">
        <TradingStrategiesSection 
          onUnlockAll={() => handlePayment(null, true)} 
        />

        <ProductsSection
          onPreview={(item) => {
            setSelectedItem(item);
            setIsPreviewOpen(true);
          }}
          onBuy={(item) => handlePayment(item)}
        />
      </div>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        item={selectedItem}
      />
    </div>
  );
}
