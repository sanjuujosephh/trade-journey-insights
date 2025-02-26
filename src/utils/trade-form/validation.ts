
import { FormData } from "@/types/trade";

export const validateTradeForm = (formData: FormData) => {
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
  
  if (formData.planned_risk_reward && parseFloat(formData.planned_risk_reward) <= 0) {
    errors.push("Planned risk/reward ratio must be greater than 0");
  }
  
  return errors;
};
