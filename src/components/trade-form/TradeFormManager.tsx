
import { FormEvent } from "react";
import { FormData, Trade } from "@/types/trade";
import { BasicTradeInfo } from "./BasicTradeInfo";
import { MarketContext } from "./MarketContext";
import { BehavioralAnalysis } from "./BehavioralAnalysis";
import { TradeFormActions } from "./TradeFormActions";
import { validateTradeForm } from "./TradeFormValidation";
import { useToast } from "@/hooks/use-toast";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <BehavioralAnalysis
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />

      <TradeFormActions isEditing={!!editingId} />
    </form>
  );
}
