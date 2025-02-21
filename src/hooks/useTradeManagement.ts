
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { transformTradeData } from "@/utils/trade-form/transformations";

export function useTradeManagement() {
  const {
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
  } = useTradeForm();

  const {
    trades,
    isLoading,
    addTrade,
    updateTrade,
  } = useTradeOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tradeData = transformTradeData(formData);
    
    try {
      if (editingId) {
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        resetForm();
      } else {
        await addTrade.mutateAsync(tradeData);
        resetForm();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
