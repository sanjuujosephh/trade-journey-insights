
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { BasicTradeInfo } from "./BasicTradeInfo";
import { MarketContext } from "./MarketContext";
import { TradeFormActions } from "./TradeFormActions";
import { FormSection } from "./FormSection";
import { useToast } from "@/hooks/use-toast";
import { validateTradeForm } from "@/utils/trade-form/validation";

interface TradeFormManagerProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const { toast } = useToast();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const errors = validateTradeForm(formData);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return;
    }

    onSubmit(e);
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
