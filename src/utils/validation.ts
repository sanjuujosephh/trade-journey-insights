
import { FormData } from "@/types/trade";

export interface ValidationError {
  [key: string]: string;
}

export function validateTradeForm(data: FormData): ValidationError {
  const errors: ValidationError = {};

  // Required fields
  if (!data.entry_price) errors.entry_price = "Entry price is required";
  if (!data.symbol) errors.symbol = "Symbol is required";
  if (!data.trade_type) errors.trade_type = "Trade type is required";
  if (!data.entry_time) errors.entry_time = "Entry time is required";

  // Numeric validations
  if (data.entry_price && isNaN(parseFloat(data.entry_price))) {
    errors.entry_price = "Entry price must be a valid number";
  }

  if (data.exit_price && isNaN(parseFloat(data.exit_price))) {
    errors.exit_price = "Exit price must be a valid number";
  }

  if (data.quantity && isNaN(parseFloat(data.quantity))) {
    errors.quantity = "Quantity must be a valid number";
  }

  // Option type validation
  if (data.trade_type === "options" && !data.option_type) {
    errors.option_type = "Option type is required for options trades";
  }

  // Logic validations
  if (data.exit_time && data.entry_time && new Date(data.exit_time) <= new Date(data.entry_time)) {
    errors.exit_time = "Exit time must be after entry time";
  }

  return errors;
}

export function hasErrors(errors: ValidationError): boolean {
  return Object.keys(errors).length > 0;
}
