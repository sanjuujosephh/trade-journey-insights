
import { FormData, Trade } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { transformTradeData } from "@/utils/trade-form/transformations";
import { isValidDateTime } from "@/utils/datetime";

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

  const validateSubmission = (formData: FormData): boolean => {
    // Validate entry date and time
    if (!isValidDateTime(formData.entry_date, formData.entry_time)) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid entry time",
        variant: "destructive"
      });
      return false;
    }

    // Validate exit date and time if provided
    if (formData.exit_date && formData.exit_time) {
      if (!isValidDateTime(formData.exit_date, formData.exit_time)) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid exit time",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const submitTrade = async (formData: FormData, editingId: string | null): Promise<boolean> => {
    try {
      if (!validateSubmission(formData)) {
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
