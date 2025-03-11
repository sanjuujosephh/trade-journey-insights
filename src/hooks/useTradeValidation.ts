
import { FormData } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { validateTradeForm } from "@/utils/trade-form/validation";
import { isValidDateTime } from "@/utils/datetime";

export function useTradeValidation() {
  const { toast } = useToast();

  const validateForm = (formData: FormData): boolean => {
    // Basic form field validation
    const validationErrors = validateBasicFields(formData);
    if (validationErrors.length > 0) {
      showValidationError(validationErrors.join(", "));
      return false;
    }

    // Date/time validation
    if (!validateDateTimes(formData)) {
      return false;
    }

    return true;
  };

  const validateBasicFields = (formData: FormData): string[] => {
    return validateTradeForm(formData);
  };

  const validateDateTimes = (formData: FormData): boolean => {
    // Validate entry date and time
    if (formData.entry_date && !isValidDateTime(formData.entry_date, formData.entry_time || '')) {
      showValidationError("Please enter valid entry date and time");
      return false;
    }

    // Validate exit date and time if provided
    if (formData.exit_date && formData.exit_time && 
        !isValidDateTime(formData.exit_date, formData.exit_time)) {
      showValidationError("Please enter valid exit date and time");
      return false;
    }

    return true;
  };

  const showValidationError = (message: string) => {
    toast({
      title: "Validation Error",
      description: message,
      variant: "destructive"
    });
  };

  return { 
    validateForm, 
    validateDateTimes,
    validateBasicFields,
    showValidationError
  };
}
