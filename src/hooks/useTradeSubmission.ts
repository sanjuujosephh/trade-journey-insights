
import { FormData, Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { transformTradeData } from "@/utils/trade-form/transformations";

interface UseTradeSubmissionProps {
  addTrade: any;
  updateTrade: any;
  resetForm: () => void;
  validateForm: (formData: FormData) => boolean;
}

export function useTradeSubmission({ 
  addTrade, 
  updateTrade, 
  resetForm,
  validateForm
}: UseTradeSubmissionProps) {
  const { toast } = useToast();

  const submitTrade = async (formData: FormData, editingId: string | null): Promise<boolean> => {
    try {
      // Validate form data before submission
      if (!validateForm(formData)) {
        return false;
      }

      console.log('Submit form data:', formData);
      const tradeData = transformTradeData(formData);
      console.log('Transformed trade data:', tradeData);
      
      if (editingId) {
        console.log('Updating trade:', editingId, tradeData);
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        toast({
          title: "Success",
          description: "Trade updated successfully"
        });
        resetForm();
        return true;
      } else {
        console.log('Adding new trade:', tradeData);
        await addTrade.mutateAsync(tradeData);
        toast({
          title: "Success",
          description: "Trade added successfully"
        });
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
