
import { useState } from "react";
import { PreviewDialog } from "./PreviewDialog";
import { TradingStrategiesSection } from "./sections/TradingStrategiesSection";
import { TradingIndicatorsSection } from "./sections/TradingIndicatorsSection";

export function StrategiesTab() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Since everything is free now, we don't need unlock functionality
  const handleUnlockAll = () => {
    // No-op since everything is already unlocked
  };
  
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-8">
        <TradingStrategiesSection 
          onUnlockAll={handleUnlockAll} 
        />

        <TradingIndicatorsSection
          onUnlockAll={handleUnlockAll}
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
