
import { FormData } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { validateTradeForm } from "@/utils/trade-form/validation";
import { isValidDateTime } from "@/utils/datetime";

export function useTradeValidation() {
  const { toast } = useToast();

  const validateForm = (formData: FormData): boolean => {
    // Validate form fields
    const errors = validateTradeForm(formData);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return false;
    }

    // Validate date and time formats
    if (formData.entry_date && !isValidDateTime(formData.entry_date, formData.entry_time || '')) {
      toast({
        title: "Invalid Date/Time",
        description: "Please enter valid entry date and time",
        variant: "destructive"
      });
      return false;
    }

    if (formData.exit_date && formData.exit_time && 
        !isValidDateTime(formData.exit_date, formData.exit_time)) {
      toast({
        title: "Invalid Date/Time",
        description: "Please enter valid exit date and time",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validateForm };
}
