
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
    console.log('Submit form data:', formData);
    const tradeData = transformTradeData(formData);
    console.log('Transformed trade data:', tradeData);
    
    try {
      if (editingId) {
        console.log('Updating trade:', editingId, tradeData);
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        resetForm();
      } else {
        console.log('Adding new trade:', tradeData);
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
