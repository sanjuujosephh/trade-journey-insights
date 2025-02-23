
import { useState, useCallback } from "react";
import { FormData, Trade } from "@/types/trade";
import { AVAILABLE_SYMBOLS } from "@/constants/tradeConstants";

const emptyFormData: FormData = {
  symbol: AVAILABLE_SYMBOLS[0],
  entry_price: "",
  exit_price: "",
  quantity: "",
  trade_type: "options",
  stop_loss: "",
  strategy: "",
  outcome: "profit",
  notes: "",
  entry_time: "",
  exit_time: "",
  chart_link: "",
  vix: "",
  call_iv: "",
  put_iv: "",
  strike_price: "",
  option_type: "",
  vwap_position: "",
  ema_position: "",
  market_condition: "",
  timeframe: "",
  trade_direction: "",
  planned_risk_reward: "",
  actual_risk_reward: "",
  planned_target: "",
  exit_reason: "",
  slippage: "",
  post_exit_price: "",
  exit_efficiency: "",
  confidence_level: "",
  entry_emotion: "",
  exit_emotion: "",
};

export function useTradeForm() {
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = useCallback(() => {
    setFormData(emptyFormData);
    setEditingId(null);
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle date fields
    if (name === 'entry_time' || name === 'exit_time') {
      try {
        // Allow empty values
        if (!value) {
          setFormData(prev => ({
            ...prev,
            [name]: '',
          }));
          return;
        }

        // Try to parse the date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          // Only set if we have a valid date
          setFormData(prev => ({
            ...prev,
            [name]: date.toISOString(),
          }));
          return;
        }

        console.warn(`Invalid date value received: ${value}`);
        setFormData(prev => ({
          ...prev,
          [name]: '',
        }));
      } catch (error) {
        console.error('Date parsing error:', error);
        setFormData(prev => ({
          ...prev,
          [name]: '',
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    resetForm,
  };
}
