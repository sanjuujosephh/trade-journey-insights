
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { BasicTradeInfo } from "./BasicTradeInfo";
import { MarketContext } from "./MarketContext";
import { TradeFormActions } from "./TradeFormActions";
import { FormSection } from "./FormSection";
import { useTradeValidation } from "@/hooks/useTradeValidation";

interface TradeFormManagerProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
  editingId: string | null;
}

export function TradeFormManager({
  formData,
  handleChange,
  handleSelectChange,
  onSubmit,
  editingId,
}: TradeFormManagerProps) {
  const { validateForm } = useTradeValidation();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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

      <TradeFormActions isEditing={!!editingId} />
    </form>
  );
}
