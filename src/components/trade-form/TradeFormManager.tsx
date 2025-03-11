
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { BasicTradeInfo } from "./BasicTradeInfo";
import { MarketContext } from "./MarketContext";
import { TradeFormActions } from "./TradeFormActions";
import { FormSection } from "./FormSection";

interface TradeFormManagerProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
  editingId: string | null;
  isSubmitting?: boolean;
}

export function TradeFormManager({
  formData,
  handleChange,
  handleSelectChange,
  onSubmit,
  editingId,
  isSubmitting = false
}: TradeFormManagerProps) {
  const isEditing = !!editingId;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection>
        <BasicTradeInfo
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
        <MarketContext
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
      </FormSection>

      <TradeFormActions 
        isEditing={isEditing} 
        isSubmitting={isSubmitting} 
      />
    </form>
  );
}
