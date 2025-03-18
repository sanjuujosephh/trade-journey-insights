
import { FormEvent } from "react";
import { FormData } from "@/types/trade";
import { BasicTradeInfo } from "./BasicTradeInfo";
import { MarketContext } from "./MarketContext";
import { TradeFormActions } from "./TradeFormActions";
import { FormSection } from "./FormSection";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface TradeFormManagerProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
  editingId: string | null;
  isSubmitting?: boolean;
  onCancelEditing?: () => void;
}

export function TradeFormManager({
  formData,
  handleChange,
  handleSelectChange,
  onSubmit,
  editingId,
  isSubmitting = false,
  onCancelEditing
}: TradeFormManagerProps) {
  const isEditing = !!editingId;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6 my-0 py-0">
      {isEditing && (
        <div className="mb-4 p-3 border-none border-primary rounded-md px-[23px] mx-[25px] flex justify-between items-center my-[40px] py-[6px] bg-gray-100">
          <p className="text-sm text-primary font-medium">
            Editing trade: {formData.symbol} {formData.entry_date}
          </p>
          
          {onCancelEditing && (
            <Button 
              onClick={onCancelEditing} 
              variant="ghost" 
              size="sm" 
              type="button" 
              className="text-primary hover:bg-primary/10"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel Editing
            </Button>
          )}
        </div>
      )}
      
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

      <TradeFormActions isEditing={isEditing} isSubmitting={isSubmitting} />
    </form>
  );
}
