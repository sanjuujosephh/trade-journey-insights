
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
  entry_date: "",
  entry_time: "",
  exit_date: "",
  exit_time: "",
  chart_link: "",
  vix: "",
  call_iv: "",
  put_iv: "",
  pcr: "",
  strike_price: "",
  option_type: "",
  vwap_position: "",
  ema_position: "",
  market_condition: "",
  timeframe: "",
  trade_direction: "",
  exit_reason: "",
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
  
  // New function to fill the form with test data
  const fillWithTestData = useCallback(() => {
    const currentDate = new Date();
    const entryDate = currentDate.toISOString().split('T')[0];
    const entryTime = currentDate.toTimeString().slice(0, 5);
    
    // Exit time 30 minutes later
    const exitDate = new Date(currentDate.getTime() + 30 * 60000);
    const exitDateStr = exitDate.toISOString().split('T')[0];
    const exitTimeStr = exitDate.toTimeString().slice(0, 5);
    
    setFormData({
      symbol: "NIFTY",
      entry_price: "250.75",
      exit_price: "275.50",
      quantity: "10",
      trade_type: "options",
      stop_loss: "230.00",
      strategy: "Momentum Breakout",
      outcome: "profit",
      notes: "Strong momentum after market open, followed the trend. Exit near resistance.",
      entry_date: entryDate,
      entry_time: entryTime,
      exit_date: exitDateStr,
      exit_time: exitTimeStr,
      chart_link: "https://tradingview.com/chart/example",
      vix: "16.5",
      call_iv: "22.4",
      put_iv: "24.8",
      pcr: "0.85",
      strike_price: "19500",
      option_type: "call",
      vwap_position: "above",
      ema_position: "above",
      market_condition: "bullish",
      timeframe: "intraday",
      trade_direction: "long",
      exit_reason: "target_reached",
      confidence_level: "8",
      entry_emotion: "confident",
      exit_emotion: "satisfied",
    });
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
    fillWithTestData,
  };
}
