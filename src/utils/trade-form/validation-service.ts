
import { FormData } from "@/types/trade";
import { isValidDateTime, isValidExitTime } from "@/utils/datetime";

// Error type with structured messages for better UI integration
export interface ValidationError {
  field?: string;
  message: string;
}

export class TradeValidationService {
  
  // Main validation method
  static validateTradeForm(formData: FormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Collect basic field validation errors
    const basicErrors = this.validateBasicFields(formData);
    errors.push(...basicErrors.map(msg => ({ message: msg })));
    
    // Validate date and time fields
    const dateTimeErrors = this.validateDateTimes(formData);
    errors.push(...dateTimeErrors);
    
    // Add more validation types as needed
    
    return errors;
  }
  
  // Basic field validation
  private static validateBasicFields(formData: FormData): string[] {
    const errors: string[] = [];
    
    if (!formData.symbol) errors.push("Symbol is required");
    if (!formData.entry_price) errors.push("Entry price is required");
    if (formData.trade_type === "options") {
      if (!formData.strike_price) {
        errors.push("Strike price is required for options trades");
      }
      if (!formData.stop_loss) {
        errors.push("Stop loss is required for options trades");
      }
    }
    
    return errors;
  }
  
  // Date and time validation
  private static validateDateTimes(formData: FormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Validate entry date and time
    if (formData.entry_date && !isValidDateTime(formData.entry_date, formData.entry_time || '')) {
      errors.push({
        field: 'entry_date_time',
        message: "Please enter valid entry date and time"
      });
    }
    
    // Validate that exit time is not before entry time on the same day
    if (formData.entry_date && formData.entry_time && formData.exit_time) {
      if (!isValidExitTime(
          formData.entry_date, 
          formData.entry_time,
          formData.entry_date, // Using entry_date for both since they're the same day
          formData.exit_time
      )) {
        errors.push({
          field: 'exit_time',
          message: "Exit time cannot be before entry time"
        });
      }
    }
    
    return errors;
  }
  
  // Helper method to validate if a trade is executable based on business rules
  static isTradeExecutable(formData: FormData): boolean {
    // Return false if required fields are missing
    if (!formData.symbol || !formData.entry_price) {
      return false;
    }
    
    // Add additional business logic here, for example:
    // - Check if user has sufficient balance/permissions
    // - Validate against market rules
    // - Check for timing restrictions
    
    return true;
  }
}
