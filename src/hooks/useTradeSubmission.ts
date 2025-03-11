
import { FormData, Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { transformTradeData } from "@/utils/trade-form/transformations";
import { useTradeValidation } from "./useTradeValidation";

interface UseTradeSubmissionProps {
  addTrade: any;
  updateTrade: any;
  resetForm: () => void;
}

export function useTradeSubmission({ 
  addTrade, 
  updateTrade, 
  resetForm 
}: UseTradeSubmissionProps) {
  const { toast } = useToast();
  const { validateForm } = useTradeValidation();

  const submitTrade = async (formData: FormData, editingId: string | null): Promise<boolean> => {
    try {
      if (!validateForm(formData)) {
        return false;
      }

      console.log('Submit form data:', formData);
      const tradeData = transformTradeData(formData);
      console.log('Transformed trade data:', tradeData);
      
      if (editingId) {
        console.log('Updating trade:', editingId, tradeData);
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        resetForm();
        return true;
      } else {
        console.log('Adding new trade:', tradeData);
        await addTrade.mutateAsync(tradeData);
        resetForm();
        return true;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save trade",
        variant: "destructive"
      });
      return false;
    }
  };

  return { submitTrade };
}
