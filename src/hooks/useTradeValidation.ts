
import { FormData } from "@/types/trade";
import { useToast } from "@/hooks/use-toast";
import { TradeValidationService, ValidationError } from "@/utils/trade-form/validation-service";

export function useTradeValidation() {
  const { toast } = useToast();

  const validateForm = (formData: FormData): boolean => {
    const errors = TradeValidationService.validateTradeForm(formData);
    
    if (errors.length > 0) {
      // Display first error to user
      showValidationError(errors[0].message);
      return false;
    }
    
    return true;
  };

  const isTradeExecutable = (formData: FormData): boolean => {
    return TradeValidationService.isTradeExecutable(formData);
  };

  const validateForSubmission = (formData: FormData): { valid: boolean, errors: ValidationError[] } => {
    const errors = TradeValidationService.validateTradeForm(formData);
    return {
      valid: errors.length === 0,
      errors
    };
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
    validateForSubmission,
    isTradeExecutable,
    showValidationError
  };
}
